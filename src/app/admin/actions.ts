"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { StoredProduct } from "@/data/catalog";
import { PRODUCTS_TAG } from "@/lib/products";
import { login, logout, requireAdmin } from "@/lib/server/admin-auth";
import { CatalogError, deletePhotos, isRemovableDemo, mutateCatalog, photoPathnames } from "@/lib/server/catalog-repo";
import { PRODUCT_ID_RE } from "@/lib/server/photos";
import { parseProductForm, uniqueSlug, type FieldErrors } from "@/lib/server/product-input";

/**
 * Acciones del panel. TODAS empiezan con requireAdmin(): una acción de servidor es un endpoint público
 * que cualquiera podría llamar, aunque el botón solo se vea con sesión.
 * Tras cambiar algo visible se llama updateTag(PRODUCTS_TAG) para que el sitio lo muestre en la siguiente carga.
 */

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, form: FormData): Promise<LoginState> {
  const result = await login(String(form.get("password") ?? ""));
  if (!result.ok) return { error: result.error };
  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/entrar");
}

/**
 * `values` + `attempt`: React 19 vacía el formulario tras cada envío; si hubo error se devuelven los datos
 * para volver a llenarlo (la dueña no debe reescribir todo por un campo mal).
 */
export type SaveState = { errors?: FieldErrors; values?: FormValues; attempt?: number };
export type FormValues = Record<string, string> & { collections?: string };

export async function saveProductAction(_prev: SaveState, form: FormData): Promise<SaveState> {
  await requireAdmin();
  const id = String(form.get("id") ?? "");
  if (!PRODUCT_ID_RE.test(id)) return { errors: { form: "No se pudo identificar la prenda. Recarga la página." } };

  const { fields, errors } = parseProductForm(form, id);
  if (!fields) return { errors, values: echo(form), attempt: Date.now() };

  let removedPhotos: string[] = [];
  try {
    await mutateCatalog((list) => {
      const now = new Date().toISOString();
      const existing = list.find((p) => p.id === id);
      if (existing) {
        removedPhotos = photoPathnames(existing).filter((p) => !fields.images.includes(`/${p}`));
        Object.assign(existing, fields, { updatedAt: now });
        // Campos opcionales que la dueña vació: se quitan (Object.assign no borra claves).
        for (const key of ["compareAt", "material", "care", "brand"] as const) if (!(key in fields)) delete existing[key];
        return list;
      }
      const slug = uniqueSlug(fields.name, new Set(list.map((p) => p.slug)));
      const created: StoredProduct = { ...fields, id, slug, createdAt: now, updatedAt: now };
      return [created, ...list];
    });
  } catch (err) {
    return { errors: { form: saveErrorMessage(err) }, values: echo(form), attempt: Date.now() };
  }
  // Las fotos quitadas se borran DESPUÉS de guardar: si el guardado falla, la prenda conserva sus fotos.
  await deletePhotos(removedPhotos).catch((err) => console.error("[admin] no se borraron fotos quitadas", err));
  updateTag(PRODUCTS_TAG);
  redirect(`/admin?aviso=guardada`);
}

/** Marca vendida: sale del sitio y pasa a "Vendidas" (30 días para restaurar). */
export async function markSoldAction(form: FormData) {
  await requireAdmin();
  const id = idFrom(form);
  await mutateCatalog((list) => setSold(list, id, new Date().toISOString()));
  updateTag(PRODUCTS_TAG);
  redirect(`/admin?aviso=vendida&id=${id}`);
}

export async function restoreAction(form: FormData) {
  await requireAdmin();
  const id = idFrom(form);
  await mutateCatalog((list) => setSold(list, id, undefined));
  updateTag(PRODUCTS_TAG);
  redirect(`/admin?aviso=restaurada`);
}

/** Borra YA una vendida (sin esperar 30 días) con sus fotos. Solo vendidas: una a la venta primero se marca vendida. */
export async function deleteNowAction(form: FormData) {
  await requireAdmin();
  const id = idFrom(form);
  let removed: StoredProduct | undefined;
  await mutateCatalog((list) => {
    removed = list.find((p) => p.id === id);
    if (!removed?.soldAt) throw new CatalogError("Solo se pueden borrar prendas vendidas.");
    return list.filter((p) => p.id !== id);
  });
  if (removed) await deletePhotos(photoPathnames(removed)).catch((err) => console.error("[admin] fotos sin borrar", err));
  redirect(`/admin?vista=vendidas&aviso=borrada`);
}

/**
 * Quita de un jalón las prendas de ejemplo (a la venta y vendidas). Sin esto la dueña tendría que
 * marcar vendida y luego borrar cada una (~44 toques). Las que ya editó con fotos suyas se respetan
 * (ver isRemovableDemo). No se borran fotos: las de ejemplo son archivos fijos del sitio, no de Blob.
 */
export async function removeDemosAction() {
  await requireAdmin();
  await mutateCatalog((list) => list.filter((p) => !isRemovableDemo(p)));
  updateTag(PRODUCTS_TAG);
  redirect(`/admin?aviso=ejemplos`);
}

/** Lo que la dueña escribió, para devolverlo al formulario. Colecciones unidas por coma. */
function echo(form: FormData): FormValues {
  const out: FormValues = {};
  for (const [k, v] of form.entries()) if (typeof v === "string" && !k.startsWith("$")) out[k] = k === "collections" && out[k] ? `${out[k]},${v}` : v;
  return out;
}

function idFrom(form: FormData) {
  const id = String(form.get("id") ?? "");
  if (!PRODUCT_ID_RE.test(id)) throw new CatalogError("Prenda inválida.");
  return id;
}

function setSold(list: StoredProduct[], id: string, soldAt: string | undefined) {
  const p = list.find((x) => x.id === id);
  if (!p) throw new CatalogError("Esa prenda ya no existe (quizá se borró).");
  if (soldAt) p.soldAt = soldAt;
  else delete p.soldAt;
  p.updatedAt = new Date().toISOString();
  return list;
}

function saveErrorMessage(err: unknown) {
  if (err instanceof CatalogError) return err.message;
  console.error("[admin] fallo al guardar", err);
  return "No se pudo guardar por un problema de conexión. Tus datos siguen aquí: intenta de nuevo.";
}
