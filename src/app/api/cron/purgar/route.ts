import { purgeExpired } from "@/lib/server/catalog-repo";

/**
 * Tarea diaria de Vercel (vercel.json → crons): borra vendidas con 30+ días y fotos huérfanas,
 * aunque la dueña no entre al panel.
 * Seguridad: si existe CRON_SECRET en Vercel, se exige (Vercel lo manda solo). Sin él, llamarla a mano
 * solo hace lo que el cron haría igual (borrar lo ya vencido), así que no expone nada.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("No autorizado", { status: 401 });
  }
  try {
    const result = await purgeExpired();
    console.log("[cron purgar]", result);
    return Response.json(result);
  } catch (err) {
    // Error visible en los logs de Vercel; mañana se reintenta y el admin también purga al entrar.
    console.error("[cron purgar] falló", err);
    return Response.json({ error: "purga fallida" }, { status: 500 });
  }
}
