import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <header style={{ background: "var(--ink)", color: "var(--paper)", padding: "88px 24px" }}>
        <div className="eyebrow" style={{ color: "var(--star)" }}>Astraea Vitamins</div>
        <h1 style={{ fontSize: "clamp(32px,5vw,52px)", margin: "12px 0" }}>
          We don't ask you to trust us. We show you.
        </h1>
        <p style={{ maxWidth: "52ch", color: "#c9d4e2", fontWeight: 300 }}>
          Every batch, independently tested. Results one scan away.
        </p>
        <Link to="/shop" style={{ color: "var(--verifyBright)" }}>Shop the line →</Link>
      </header>
      {/* TODO: port hero constellation SVG, how-it-works steps, line-split blocks,
          and "why we test" band from design-reference/mockups/storefront.html */}
    </div>
  );
}
