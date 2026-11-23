import type { ArtKind } from "@/data/catalog";

/**
 * Ilustración plana de la prenda. Respaldo mientras no hay fotos reales:
 * así el demo se ve profesional sin usar fotos de terceros (derechos de autor).
 * Cuando el producto tenga `images`, ProductImage usa la foto y esto deja de verse.
 * Fondo oscuro con línea dorada para que prendas negras se distingan del fondo negro del sitio.
 */
const shapes: Record<ArtKind, { body: string; line?: string }> = {
  tee: { body: "M70 40L95 30C100 42 140 42 145 30L170 40L190 75L165 85L160 75V170H80V75L75 85L50 75Z" },
  blouse: { body: "M78 38L100 30Q120 52 140 30L162 38L182 80L160 88L156 80L162 170H78L84 80L80 88L58 80Z" },
  shirt: { body: "M75 36L100 28L120 48L140 28L165 36L188 120L168 124L160 82V172H80V82L72 124L52 120Z", line: "M120 48V172" },
  pants: { body: "M80 30H160L170 172H132L120 80L108 172H70Z", line: "M80 44H160" },
  dress: { body: "M95 28H145L140 62L178 172H62L100 62Z", line: "M100 62H140" },
  skirt: { body: "M88 50H152L180 160H60Z", line: "M104 50L92 160M120 50V160M136 50L148 160" },
  jacket: { body: "M72 36L100 26L120 40L140 26L168 36L192 160H168L162 90V172H78V90L72 160H48Z", line: "M120 40V172" },
  // Abrigo: largo hasta abajo y con botones; se distingue de la chamarra por el largo.
  coat: { body: "M74 30L100 22L120 44L140 22L166 30L190 150H170L164 90V186H76V90L70 150H50Z", line: "M120 44V186M112 80H112.1M112 110H112.1M112 140H112.1" },
  // Saco: solapas en V y un botón; corte al talle.
  blazer: { body: "M74 34L100 26L120 70L140 26L166 34L190 150H170L164 92V170H76V92L70 150H50Z", line: "M100 26L112 60L120 70L128 60L140 26M120 70V170M120 112H120.1" },
  hoodie: { body: "M90 40Q90 14 120 14Q150 14 150 40L172 46L192 150H170L164 90V172H76V90L70 150H48L68 46Z", line: "M96 120H144V150H96Z" },
  shoe: { body: "M40 120L60 80H110Q130 100 170 104Q198 108 200 132V144H40Z", line: "M40 132H200" },
  bag: { body: "M60 80H180L170 172H70Z", line: "M92 80Q92 40 120 40Q148 40 148 80" },
};

export function ProductArt({ kind, color, label }: { kind: ArtKind; color: string; label: string }) {
  const { body, line } = shapes[kind];
  return (
    <svg viewBox="0 0 240 200" className="h-full w-full" role="img" aria-label={label || undefined} aria-hidden={label ? undefined : true} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="art-bg" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#2A251C" />
          <stop offset="100%" stopColor="#15130F" />
        </radialGradient>
      </defs>
      <rect width="240" height="200" fill="url(#art-bg)" />
      <ellipse cx="120" cy="190" rx="80" ry="6" fill="#000" opacity="0.5" />
      <path d={body} fill={color} stroke="#F2C230" strokeOpacity="0.55" strokeWidth="1.5" strokeLinejoin="round" />
      {line && <path d={line} fill="none" stroke="#F2C230" strokeOpacity="0.6" strokeWidth="2.5" strokeLinecap="round" />}
    </svg>
  );
}
