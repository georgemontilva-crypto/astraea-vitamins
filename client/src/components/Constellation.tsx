export default function Constellation() {
  return (
    <svg
      className="constellation"
      viewBox="0 0 1200 560"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g stroke="#A9C0D8" strokeWidth={0.7} opacity={0.5}>
        <line x1="880" y1="90" x2="960" y2="150" />
        <line x1="960" y1="150" x2="1030" y2="120" />
        <line x1="960" y1="150" x2="1005" y2="250" />
        <line x1="1005" y1="250" x2="1100" y2="300" />
        <line x1="1005" y1="250" x2="915" y2="330" />
        <line x1="915" y1="330" x2="970" y2="430" />
        <line x1="915" y1="330" x2="815" y2="370" />
      </g>
      <g fill="#A9C0D8">
        <circle cx="880" cy="90" r="2.4" />
        <circle cx="960" cy="150" r="3.6" />
        <circle cx="1030" cy="120" r="2" />
        <circle cx="1005" cy="250" r="2.8" />
        <circle cx="1100" cy="300" r="2" />
        <circle cx="915" cy="330" r="4" />
        <circle cx="970" cy="430" r="2.2" />
        <circle cx="815" cy="370" r="2" />
        <circle cx="150" cy="130" r="1.4" />
        <circle cx="250" cy="440" r="1.4" />
        <circle cx="430" cy="90" r="1.2" />
        <circle cx="620" cy="470" r="1.4" />
        <circle cx="90" cy="320" r="1.2" />
        <circle cx="540" cy="270" r="1" />
      </g>
    </svg>
  );
}
