import Link from "next/link";

/** Astas de reno: símbolo de marca (Reno = reno en español). Misma geometría que public/logos/*.svg. */
export function AntlerMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M30 58C30 44 26 34 18 24C14 19 10 14 8 6M22 30C16 30 10 28 5 23M14 18C17 13 18 9 18 4" />
      <path d="M34 58C34 44 38 34 46 24C50 19 54 14 56 6M42 30C48 30 54 28 59 23M50 18C47 13 46 9 46 4" />
    </svg>
  );
}

/** Logo del header/footer (opción A provisional hasta que la dueña elija en /logos). */
export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const text = tone === "dark" ? "text-ink" : "text-crema";
  return (
    <Link href="/" className={`inline-flex min-h-11 items-center gap-2 ${text}`} aria-label="Reno, ir al inicio">
      <AntlerMark className="h-8 w-8 text-terracota" />
      <span className="font-display text-2xl font-bold tracking-[0.2em]">RENO</span>
    </Link>
  );
}
