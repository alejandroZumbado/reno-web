"use client";

import { useSyncExternalStore } from "react";

/**
 * "Mi lista": prendas que la clienta junta para mandarlas en UN solo WhatsApp (pedido de la dueña:
 * agregar funciones a WhatsApp). Sin cuentas ni BD: vive en localStorage de su celular.
 *
 * Gotchas:
 * - localStorage puede fallar (modo incógnito de Safari, almacenamiento lleno o bloqueado):
 *   cada acceso va en try/catch y la lista sigue funcionando en memoria mientras la página esté abierta.
 * - Se usa useSyncExternalStore para que el HTML prerenderizado (lista vacía) no choque con el del
 *   navegador (lista guardada) al hidratar.
 * - La clave lleva versión (v1): si cambia la forma de MyListItem, subir a v2 en vez de migrar.
 */

export type MyListItem = {
  slug: string;
  name: string;
  price: number;
  size?: string;
  color?: string;
};

const STORAGE_KEY = "reno:mi-lista:v1";
// Tope para que el mensaje de WhatsApp no se vuelva enorme (los links muy largos fallan en algunos celulares).
export const MY_LIST_MAX = 20;

const EMPTY: MyListItem[] = [];
let items: MyListItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

/** Misma prenda con otra talla/color = otra línea: la dueña necesita saber exactamente qué separar. */
const keyOf = (i: Pick<MyListItem, "slug" | "size" | "color">) => `${i.slug}|${i.size ?? ""}|${i.color ?? ""}`;

function isItem(v: unknown): v is MyListItem {
  const o = v as MyListItem;
  return typeof o?.slug === "string" && typeof o.name === "string" && typeof o.price === "number";
}

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    // Datos corruptos o de otra versión: se descartan en vez de romper la página.
    items = Array.isArray(parsed) ? parsed.filter(isItem).slice(0, MY_LIST_MAX) : EMPTY;
  } catch {
    items = EMPTY;
  }
}

function save(next: MyListItem[]) {
  items = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Sin almacenamiento la lista dura solo esta visita; no hay nada más que hacer ni que mostrar.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  // Sincroniza si la clienta tiene el sitio abierto en dos pestañas.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    loaded = false;
    load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Lista actual. En el servidor y en el primer render siempre es vacía. */
export function useMyList() {
  return useSyncExternalStore(
    subscribe,
    () => (load(), items),
    () => EMPTY,
  );
}

/**
 * Agrega una prenda. Devuelve "added", "duplicate" (ya estaba igual) o "full" (llegó al tope)
 * para que el botón diga qué pasó en vez de fallar callado.
 */
export function addToMyList(item: MyListItem): "added" | "duplicate" | "full" {
  load();
  if (items.some((i) => keyOf(i) === keyOf(item))) return "duplicate";
  if (items.length >= MY_LIST_MAX) return "full";
  save([...items, item]);
  return "added";
}

export function removeFromMyList(item: MyListItem) {
  load();
  save(items.filter((i) => keyOf(i) !== keyOf(item)));
}

export function clearMyList() {
  save(EMPTY);
}

export { keyOf as myListKey };

const noop = () => () => {};

/**
 * false en el HTML prerenderizado, true ya en el navegador. Sirve para no mostrar
 * "Tu lista está vacía" un instante antes de leer la lista guardada.
 */
export function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}
