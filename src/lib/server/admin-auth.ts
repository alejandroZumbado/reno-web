import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { get, put } from "@vercel/blob";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { freshRead } from "./catalog-repo";
import { connection } from "next/server";

/**
 * Acceso al panel: UNA contraseña (solo entra la dueña, decisión de Alejandro 2026-11-23).
 *
 * - La contraseña vive en la variable de entorno ADMIN_PASSWORD de Vercel (la pone Alejandro; nunca en el código).
 * - Sesión: cookie httpOnly + SameSite=Strict, firmada con HMAC. La clave de firma se deriva de la contraseña:
 *   al cambiar ADMIN_PASSWORD se cierran todas las sesiones abiertas (útil si se filtra).
 * - Fuerza bruta: 5 intentos fallidos por IP cada 15 min y 30 en total por hora; se guardan en Blob privado
 *   para que valgan entre servidores. Cada fallo además tarda ~1 s.
 * - Toda acción del admin llama requireAdmin(): el proxy solo redirige, no es la protección real.
 */

export const SESSION_COOKIE = "reno_admin";
const SESSION_DAYS = 14;
const MIN_PASSWORD_LENGTH = 12;
const ATTEMPTS_PATH = "seguridad/intentos.json";
const PER_IP = { max: 5, windowMs: 15 * 60_000 };
const GLOBAL = { max: 30, windowMs: 60 * 60_000 };
const FAIL_DELAY_MS = 1000;

export class AdminConfigError extends Error {}

function password(): string {
  const value = process.env.ADMIN_PASSWORD;
  if (!value || value.length < MIN_PASSWORD_LENGTH) {
    throw new AdminConfigError(`Falta ADMIN_PASSWORD en Vercel (mínimo ${MIN_PASSWORD_LENGTH} caracteres).`);
  }
  return value;
}

function signingKey() {
  return createHmac("sha256", password()).update("reno-admin-session-v1").digest();
}

function sign(payload: string) {
  return createHmac("sha256", signingKey()).update(payload).digest("base64url");
}

/** Compara en tiempo constante (hash primero para que el largo no se filtre). */
function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [exp, nonce, sig] = token.split(".");
  if (!exp || !nonce || !sig) return false;
  try {
    if (!safeEqual(sig, sign(`${exp}.${nonce}`))) return false;
  } catch (err) {
    if (err instanceof AdminConfigError) return false;
    throw err;
  }
  return Number(exp) > Date.now();
}

/** ¿La petición actual trae una sesión válida? */
export async function isAdmin(): Promise<boolean> {
  // connection(): la sesión depende de la hora actual (vencimiento); nunca debe prerenderizarse.
  await connection();
  return verifyToken((await cookies()).get(SESSION_COOKIE)?.value);
}

/** Corta (redirige a entrar) si no hay sesión. Llamar al inicio de TODA página y acción del admin. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/entrar");
}

type Attempts = { failures: { ip: string; at: number }[] };

async function readAttempts(): Promise<Attempts> {
  const res = await get(ATTEMPTS_PATH, freshRead());
  if (!res || res.statusCode !== 200) return { failures: [] };
  try {
    const data = JSON.parse(await new Response(res.stream).text()) as Attempts;
    return Array.isArray(data.failures) ? data : { failures: [] };
  } catch {
    // Archivo dañado: se reinicia el conteo (peor caso: un atacante gana una ventana de intentos).
    return { failures: [] };
  }
}

async function writeAttempts(data: Attempts) {
  await put(ATTEMPTS_PATH, JSON.stringify(data), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function clientIpHash() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "desconocida";
  // Se guarda el hash, no la IP: no hace falta conservar datos personales para limitar intentos.
  return createHash("sha256").update(`reno:${ip}`).digest("hex").slice(0, 32);
}

export type LoginResult = { ok: true } | { ok: false; error: string };

/** Valida la contraseña, aplica el límite de intentos y abre la sesión. */
export async function login(input: string): Promise<LoginResult> {
  let expected: string;
  try {
    expected = password();
  } catch (err) {
    if (err instanceof AdminConfigError) return { ok: false, error: "El panel aún no tiene contraseña configurada. Avísale a Alejandro." };
    throw err;
  }

  const now = Date.now();
  const ip = await clientIpHash();
  const attempts = await readAttempts();
  const recent = attempts.failures.filter((f) => now - f.at < GLOBAL.windowMs);
  const fromIp = recent.filter((f) => f.ip === ip && now - f.at < PER_IP.windowMs);
  if (fromIp.length >= PER_IP.max || recent.length >= GLOBAL.max) {
    return { ok: false, error: "Demasiados intentos. Espera 15 minutos y vuelve a intentar." };
  }

  if (!safeEqual(input, expected)) {
    await writeAttempts({ failures: [...recent, { ip, at: now }] });
    await new Promise((r) => setTimeout(r, FAIL_DELAY_MS));
    const left = PER_IP.max - fromIp.length - 1;
    return { ok: false, error: left > 0 ? `Contraseña incorrecta. Te quedan ${left} intentos.` : "Contraseña incorrecta. Espera 15 minutos." };
  }

  // Éxito: se limpian los fallos de esta IP.
  if (fromIp.length) await writeAttempts({ failures: recent.filter((f) => f.ip !== ip) });
  const exp = now + SESSION_DAYS * 86_400_000;
  const nonce = randomBytes(16).toString("base64url");
  (await cookies()).set(SESSION_COOKIE, `${exp}.${nonce}.${sign(`${exp}.${nonce}`)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
  return { ok: true };
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
}
