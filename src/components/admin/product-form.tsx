"use client";

import Link from "next/link";
import { useActionState, useState, type ReactNode } from "react";
import { saveProductAction, type FormValues, type SaveState } from "@/app/admin/actions";
import type { FieldErrors } from "@/lib/server/product-input";
import {
  audiences,
  categoriesFor,
  collections,
  colorOptions,
  sizePresetsFor,
  type AudienceId,
  type CategoryId,
  type StoredProduct,
} from "@/data/catalog";
import { PhotoField } from "./photo-field";

/**
 * Alta y edición de una prenda (pieza única: una talla y un color).
 * Orden pensado para la dueña con la prenda en la mano: fotos → nombre y precio → sección/tipo → talla → color.
 * Todo lo opcional va plegado en "Más detalles" para no llenar la pantalla.
 * Los errores del servidor se muestran junto a cada campo; lo escrito no se pierde.
 */
export function ProductForm({ productId, product }: { productId: string; product?: StoredProduct }) {
  const [state, action, pending] = useActionState<SaveState, FormData>(saveProductAction, {});
  return (
    <form action={action} className="space-y-10" noValidate>
      <input type="hidden" name="id" value={productId} />
      {/* key: tras un envío con error se vuelven a montar los campos con lo que se escribió (ver SaveState). */}
      <FormFields key={state.attempt ?? 0} productId={productId} draft={draftFrom(product, state.values)} errors={state.errors ?? {}} pending={pending} editing={!!product} />
    </form>
  );
}

/** Valores iniciales: lo que se acaba de enviar (si hubo error) o la prenda guardada. */
type Draft = {
  name?: string; price?: string; compareAt?: string; audience: AudienceId; category?: CategoryId; size?: string; color?: string;
  description?: string; brand?: string; material?: string; care?: string; collections: string[]; images: string[];
};

function draftFrom(product: StoredProduct | undefined, values: FormValues | undefined): Draft {
  if (values) {
    let images: string[] = [];
    try {
      images = JSON.parse(values.images ?? "[]");
    } catch {
      // Campo oculto dañado: se empieza sin fotos en vez de romper el formulario.
    }
    return {
      ...values,
      audience: (values.audience as AudienceId) || "mujer",
      category: (values.category as CategoryId) || undefined,
      collections: values.collections ? values.collections.split(",") : [],
      images,
    };
  }
  return {
    name: product?.name, price: product?.price?.toString(), compareAt: product?.compareAt?.toString(),
    audience: product?.audience ?? "mujer", category: product?.category, size: product?.size, color: product?.color.name,
    description: product?.description, brand: product?.brand, material: product?.material, care: product?.care,
    collections: product?.collections ?? [], images: product?.images ?? [],
  };
}

function FormFields({ productId, draft, errors, pending, editing }: { productId: string; draft: Draft; errors: FieldErrors; pending: boolean; editing: boolean }) {
  const [audience, setAudience] = useState<AudienceId>(draft.audience);
  const [category, setCategory] = useState<CategoryId | undefined>(draft.category);
  const [uploading, setUploading] = useState(false);

  const typeOptions = categoriesFor(audience);
  const validCategory = category && typeOptions.some((c) => c.id === category) ? category : undefined;

  return (
    <>

      <PhotoField productId={productId} initial={draft.images} error={errors.images} onBusyChange={setUploading} />

      <Group title="Lo básico">
        <Field label="Nombre de la prenda" error={errors.name} htmlFor="name">
          <input id="name" name="name" defaultValue={draft.name} required maxLength={80} placeholder="Ej. Blusa satinada cuello V" className="admin-input" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Precio" error={errors.price} htmlFor="price">
            <MoneyInput id="price" name="price" defaultValue={draft.price} invalid={!!errors.price} required />
          </Field>
          <Field label="Precio anterior (opcional)" hint="Si lo pones, la prenda sale como oferta." error={errors.compareAt} htmlFor="compareAt">
            <MoneyInput id="compareAt" name="compareAt" defaultValue={draft.compareAt} invalid={!!errors.compareAt} />
          </Field>
        </div>
      </Group>

      <Group title="Sección y tipo">
        <Choices legend="Sección" error={errors.audience}>
          {audiences.map((a) => (
            <Chip key={a.id} name="audience" value={a.id} checked={audience === a.id} onChange={() => setAudience(a.id)}>
              {a.label}
            </Chip>
          ))}
        </Choices>
        <Choices legend="Tipo de prenda" error={errors.category}>
          {typeOptions.map((c) => (
            <Chip key={c.id} name="category" value={c.id} checked={validCategory === c.id} onChange={() => setCategory(c.id)}>
              {c.label}
            </Chip>
          ))}
        </Choices>
      </Group>

      {/* key: al cambiar tipo/sección cambian las tallas sugeridas; se reinicia la elección. */}
      <SizePicker key={`${audience}|${validCategory}`} presets={validCategory ? sizePresetsFor(validCategory, audience) : []} initial={draft.size} error={errors.size} needsCategory={!validCategory} />

      <Choices legend="Color" error={errors.color}>
        {colorOptions.map((c) => (
          <label key={c.name} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line px-3 text-sm has-checked:border-gold has-checked:bg-gold/10 has-focus-visible:outline has-focus-visible:outline-3 has-focus-visible:outline-gold">
            <input type="radio" name="color" value={c.name} defaultChecked={draft.color === c.name} className="sr-only" />
            <span className="h-5 w-5 rounded-full border border-white/25" style={{ background: c.hex }} aria-hidden="true" />
            {c.name}
          </label>
        ))}
      </Choices>

      <Field label="Descripción (opcional)" hint="Una o dos frases: para qué ocasión, cómo queda." htmlFor="description">
        <textarea id="description" name="description" rows={3} maxLength={500} defaultValue={draft.description} className="admin-input" />
      </Field>

      <details className="rounded-lg border border-line bg-surface px-4 py-3 open:pb-5" open={!!(draft.material || draft.care || draft.brand || draft.collections.length)}>
        <summary className="min-h-11 cursor-pointer content-center text-lg">Más detalles</summary>
        <div className="mt-4 space-y-5">
          <Field label="Marca" htmlFor="brand">
            <input id="brand" name="brand" maxLength={40} defaultValue={draft.brand} className="admin-input" />
          </Field>
          <Field label="Material" htmlFor="material">
            <input id="material" name="material" maxLength={100} defaultValue={draft.material} placeholder="Ej. 100% algodón" className="admin-input" />
          </Field>
          <Field label="Cuidados" htmlFor="care">
            <input id="care" name="care" maxLength={150} defaultValue={draft.care} placeholder="Ej. Lavar a mano en agua fría" className="admin-input" />
          </Field>
          <Choices legend="Aparece también en">
            {collections
              .filter((c) => c.id !== "ofertas")
              .map((c) => (
                <label key={c.id} className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line px-4 text-sm has-checked:border-gold has-checked:bg-gold has-checked:text-black has-focus-visible:outline has-focus-visible:outline-3 has-focus-visible:outline-gold">
                  <input type="checkbox" name="collections" value={c.id} defaultChecked={draft.collections.includes(c.id)} className="sr-only" />
                  {c.label}
                </label>
              ))}
          </Choices>
        </div>
      </details>

      {errors.form && <p role="alert" className="rounded-lg border border-alert/50 px-4 py-3 text-alert">{errors.form}</p>}
      {Object.keys(errors).length > 0 && !errors.form && (
        <p role="alert" className="text-alert">Revisa los campos marcados.</p>
      )}

      {/* Barra fija: guardar siempre a la vista sin bajar hasta el final del formulario. */}
      <div className="sticky bottom-0 -mx-4 flex gap-3 border-t border-line bg-night/95 px-4 py-3 backdrop-blur">
        <Link href="/admin" className="inline-flex min-h-14 items-center justify-center rounded-full border border-line px-6">Cancelar</Link>
        <button type="submit" disabled={pending || uploading} className="flex min-h-14 flex-1 items-center justify-center rounded-full foil-bg text-lg font-medium disabled:opacity-60">
          {pending ? "Guardando…" : uploading ? "Esperando fotos…" : editing ? "Guardar cambios" : "Guardar prenda"}
        </button>
      </div>
    </>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-5">
      <h2 className="text-lg">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, hint, error, htmlFor, children }: { label: string; hint?: string; error?: string; htmlFor: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm">{label}</label>
      {children}
      {hint && !error && <p className="mt-1.5 text-sm text-muted">{hint}</p>}
      {error && <p id={`${htmlFor}-error`} className="mt-1.5 text-sm text-alert">{error}</p>}
    </div>
  );
}

function MoneyInput({ id, name, defaultValue, invalid, required }: { id: string; name: string; defaultValue?: string; invalid: boolean; required?: boolean }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted" aria-hidden="true">$</span>
      <input
        id={id}
        name={name}
        inputMode="numeric"
        pattern="[0-9]*"
        defaultValue={defaultValue}
        required={required}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className="admin-input pl-8"
      />
    </div>
  );
}

function Choices({ legend, error, children }: { legend: string; error?: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm">{legend}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
      {error && <p className="mt-1.5 text-sm text-alert">{error}</p>}
    </fieldset>
  );
}

function Chip({ name, value, checked, onChange, children }: { name: string; value: string; checked: boolean; onChange: () => void; children: ReactNode }) {
  return (
    <label className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line px-4 text-sm has-checked:border-gold has-checked:bg-gold has-checked:text-black has-focus-visible:outline has-focus-visible:outline-3 has-focus-visible:outline-gold">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      {children}
    </label>
  );
}

/** Talla: toque en una sugerida o "Otra" para escribirla. Solo una (pieza única). */
function SizePicker({ presets, initial, error, needsCategory }: { presets: string[]; initial?: string; error?: string; needsCategory: boolean }) {
  const startsCustom = !!initial && !presets.includes(initial);
  const [choice, setChoice] = useState<string | undefined>(startsCustom ? "__otra" : initial);
  const [custom, setCustom] = useState(startsCustom ? initial : "");
  const value = choice === "__otra" ? custom : choice ?? "";

  return (
    <fieldset>
      <legend className="mb-2 text-lg">Talla</legend>
      <input type="hidden" name="size" value={value} />
      {needsCategory ? (
        <p className="text-sm text-muted">Primero elige el tipo de prenda para ver sus tallas.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {presets.map((s) => (
            <Chip key={s} name="size-choice" value={s} checked={choice === s} onChange={() => setChoice(s)}>
              {s}
            </Chip>
          ))}
          <Chip name="size-choice" value="__otra" checked={choice === "__otra"} onChange={() => setChoice("__otra")}>
            Otra
          </Chip>
        </div>
      )}
      {choice === "__otra" && (
        <div className="mt-3 max-w-48">
          <label htmlFor="size-custom" className="mb-1.5 block text-sm">Escribe la talla</label>
          <input id="size-custom" value={custom} onChange={(e) => setCustom(e.target.value)} maxLength={12} className="admin-input" autoFocus />
        </div>
      )}
      {error && <p className="mt-1.5 text-sm text-alert">{error}</p>}
    </fieldset>
  );
}
