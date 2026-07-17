type BottleProps = {
  name: string;
  line: "Wellness" | "Sport";
  format: string;
  big?: boolean;
};

/** Placeholder bottle/jar art — ported 1:1 from the bottle() function in
 * design-reference/mockups/storefront.html. Swap for real product photography
 * once it lands (see README "Pending from client"). */
export default function BottleArt({ name, line, format, big = false }: BottleProps) {
  const accent = line === "Wellness" ? "#41628a" : "#C08A3E";
  const w = big ? 150 : 104;
  const h = big ? 250 : 150;
  const isPowder = format === "powder" || format === "stick";
  const firstWord = name.split(" ")[0];

  if (isPowder) {
    return (
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true">
        <rect x={w * 0.12} y={h * 0.1} width={w * 0.76} height={h * 0.14} rx={4} fill="#0E1B2E" />
        <rect x={w * 0.08} y={h * 0.24} width={w * 0.84} height={h * 0.68} rx={6} fill="#FDFCF9" stroke="#C9C5B8" />
        <rect x={w * 0.08} y={h * 0.24} width={w * 0.84} height={4} fill={accent} />
        <text x={w * 0.5} y={h * 0.42} textAnchor="middle" fontFamily="Marcellus,serif" fontSize={big ? 13 : 9} fill="#0E1B2E">
          {firstWord}
        </text>
        <text x={w * 0.5} y={h * 0.52} textAnchor="middle" fontFamily="'IBM Plex Mono',monospace" fontSize={big ? 7 : 5} fill="#5a6478">
          TESTED
        </text>
        <rect x={w * 0.08} y={h * 0.74} width={w * 0.84} height={h * 0.18} fill="#0E1B2E" />
        <text x={w * 0.5} y={h * 0.845} textAnchor="middle" fontFamily="'IBM Plex Mono',monospace" fontSize={big ? 6.5 : 4.6} fill="#5FD6A7">
          CHECK THE TESTING
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true">
      <rect x={w * 0.32} y={h * 0.02} width={w * 0.36} height={h * 0.1} rx={3} fill="#0E1B2E" />
      <path
        d={`M${w * 0.3} ${h * 0.12} Q${w * 0.3} ${h * 0.08} ${w * 0.36} ${h * 0.08} L${w * 0.64} ${h * 0.08} Q${w * 0.7} ${h * 0.08} ${w * 0.7} ${h * 0.12} L${w * 0.72} ${h * 0.2} Q${w * 0.78} ${h * 0.24} ${w * 0.78} ${h * 0.32} L${w * 0.78} ${h * 0.94} Q${w * 0.78} ${h * 0.99} ${w * 0.72} ${h * 0.99} L${w * 0.28} ${h * 0.99} Q${w * 0.22} ${h * 0.99} ${w * 0.22} ${h * 0.94} L${w * 0.22} ${h * 0.32} Q${w * 0.22} ${h * 0.24} ${w * 0.28} ${h * 0.2} Z`}
        fill="#FDFCF9"
        stroke="#C9C5B8"
      />
      <rect x={w * 0.22} y={h * 0.34} width={w * 0.56} height={h * 0.44} fill="#F7F6F1" stroke="#e3e0d7" strokeWidth={0.5} />
      <rect x={w * 0.22} y={h * 0.34} width={w * 0.56} height={3} fill={accent} />
      <text x={w * 0.5} y={h * 0.46} textAnchor="middle" fontFamily="Marcellus,serif" fontSize={big ? 7.5 : 5.6} letterSpacing={1.5} fill="#0E1B2E">
        ASTRAEA
      </text>
      <text x={w * 0.5} y={h * 0.57} textAnchor="middle" fontFamily="Marcellus,serif" fontSize={big ? 9 : 6.4} fill="#0E1B2E">
        {firstWord}
      </text>
      <rect x={w * 0.22} y={h * 0.66} width={w * 0.56} height={h * 0.12} fill="#0E1B2E" />
      <text x={w * 0.5} y={h * 0.735} textAnchor="middle" fontFamily="'IBM Plex Mono',monospace" fontSize={big ? 5.4 : 3.9} fill="#5FD6A7">
        CHECK THE TESTING
      </text>
    </svg>
  );
}
