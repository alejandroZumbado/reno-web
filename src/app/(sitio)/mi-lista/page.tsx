import type { Metadata } from "next";
import { MyListView } from "@/components/my-list-view";

export const metadata: Metadata = {
  title: "Mi lista",
  description: "Junta tus prendas y mándalas en un solo mensaje de WhatsApp.",
  // Contenido distinto en cada celular: no tiene sentido indexarlo.
  robots: { index: false, follow: true },
};

export default function MyListPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
      <h1 className="font-display text-4xl sm:text-5xl">Mi lista</h1>
      <p className="mt-3 text-muted">Reúne las piezas que te gustan y envíalas en un solo mensaje. Te confirmamos disponibilidad por WhatsApp.</p>
      <MyListView />
    </div>
  );
}
