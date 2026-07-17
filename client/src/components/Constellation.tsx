type Node = { id: string; x: number; y: number; r: number; delay: number; dur: number };
type Link = { a: string; b: string; delay: number };

// Dense molecule cluster, weighted to the right side of the hero.
const NODES: Node[] = [
  { id: "a", x: 760, y: 80, r: 2.2, delay: 0.2, dur: 3.4 },
  { id: "b", x: 840, y: 50, r: 1.8, delay: 1.1, dur: 4.1 },
  { id: "c", x: 900, y: 120, r: 3.2, delay: 0.6, dur: 3.8 },
  { id: "d", x: 980, y: 70, r: 2, delay: 1.8, dur: 3.2 },
  { id: "e", x: 1040, y: 140, r: 2.6, delay: 0.4, dur: 4.4 },
  { id: "f", x: 960, y: 200, r: 3.8, delay: 0.9, dur: 3.6 },
  { id: "g", x: 1105, y: 190, r: 2.2, delay: 1.4, dur: 4 },
  { id: "h", x: 1150, y: 100, r: 1.6, delay: 0.3, dur: 3.9 },
  { id: "i", x: 1030, y: 270, r: 3, delay: 1.6, dur: 3.3 },
  { id: "j", x: 1120, y: 300, r: 2.4, delay: 0.7, dur: 4.2 },
  { id: "k", x: 900, y: 260, r: 2, delay: 1.2, dur: 3.7 },
  { id: "l", x: 950, y: 340, r: 4.2, delay: 0.5, dur: 3.5 },
  { id: "m", x: 1040, y: 400, r: 2.4, delay: 1.9, dur: 4.3 },
  { id: "n", x: 855, y: 330, r: 2, delay: 1, dur: 3.1 },
  { id: "o", x: 830, y: 410, r: 2.8, delay: 0.15, dur: 4 },
  { id: "p", x: 900, y: 460, r: 2, delay: 1.5, dur: 3.6 },
  { id: "q", x: 990, y: 480, r: 1.8, delay: 0.8, dur: 4.1 },
  { id: "r", x: 1140, y: 420, r: 1.6, delay: 1.3, dur: 3.4 },
  { id: "s", x: 730, y: 250, r: 1.6, delay: 0.45, dur: 3.9 },
  { id: "t", x: 760, y: 440, r: 1.4, delay: 1.7, dur: 3.2 },
];

const LINKS: Link[] = [
  { a: "a", b: "c", delay: 0.2 }, { a: "b", b: "c", delay: 0.9 }, { a: "c", b: "d", delay: 0.4 },
  { a: "c", b: "f", delay: 1.3 }, { a: "d", b: "e", delay: 0.6 }, { a: "e", b: "f", delay: 1.7 },
  { a: "e", b: "h", delay: 0.3 }, { a: "e", b: "g", delay: 1.1 }, { a: "g", b: "h", delay: 0.8 },
  { a: "f", b: "i", delay: 1.5 }, { a: "i", b: "j", delay: 0.5 }, { a: "i", b: "g", delay: 1.9 },
  { a: "f", b: "k", delay: 0.7 }, { a: "k", b: "l", delay: 1.2 }, { a: "l", b: "n", delay: 0.35 },
  { a: "l", b: "i", delay: 1.6 }, { a: "l", b: "m", delay: 0.55 }, { a: "m", b: "j", delay: 1.4 },
  { a: "n", b: "o", delay: 0.25 }, { a: "o", b: "p", delay: 1 },
  { a: "p", b: "q", delay: 0.65 }, { a: "q", b: "m", delay: 1.8 }, { a: "n", b: "s", delay: 0.9 },
  { a: "o", b: "t", delay: 1.3 }, { a: "s", b: "k", delay: 0.15 }, { a: "q", b: "r", delay: 0.85 },
  { a: "m", b: "r", delay: 1.45 },
];

// Sparse ambient dust, low opacity, scattered left/mid — no connecting lines.
const DUST = [
  { x: 130, y: 130 }, { x: 230, y: 440 }, { x: 410, y: 90 }, { x: 600, y: 470 },
  { x: 70, y: 320 }, { x: 520, y: 260 }, { x: 320, y: 200 }, { x: 470, y: 400 },
];

export default function Constellation() {
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <svg className="constellation" viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g stroke="#A9C0D8" strokeWidth={0.6}>
        {LINKS.map((l, i) => {
          const a = byId[l.a];
          const b = byId[l.b];
          if (!a || !b) return null;
          return (
            <line
              key={i}
              className="const-link"
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              style={{ animationDelay: `${l.delay}s` }}
            />
          );
        })}
      </g>
      <g fill="#5FD6A7" opacity={0.5}>
        {DUST.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={1.2} />
        ))}
      </g>
      <g fill="#A9C0D8">
        {NODES.map((n) => (
          <circle
            key={n.id}
            className="const-node"
            cx={n.x} cy={n.y} r={n.r}
            style={{ animationDelay: `${n.delay}s`, animationDuration: `${n.dur}s` }}
          />
        ))}
      </g>
    </svg>
  );
}
