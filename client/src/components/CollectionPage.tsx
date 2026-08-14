import ProductCard from "./ProductCard";
import { trpc } from "../lib/trpc";

export default function CollectionPage({
  line,
  accentVar,
  tagline,
}: {
  line: "Wellness" | "Sport";
  accentVar: string;
  tagline: string;
}) {
  const { data: products, isLoading } = trpc.products.list.useQuery({ line });

  return (
    <div>
      <header className="hero" style={{ background: line === "Wellness" ? "linear-gradient(160deg,#2a3f5c,#0E1B2E)" : "linear-gradient(160deg,#7a5423,#0E1B2E)" }}>
        <div className="wrap" style={{ padding: "76px 32px" }}>
          <div className="eyebrow" style={{ color: accentVar }}>{line} line</div>
          <h1 style={{ maxWidth: "18ch" }}>{tagline}</h1>
          <p className="sub" style={{ maxWidth: "50ch" }}>
            Every {line} product, tested the same way as everything else Astraea makes — no
            separate standard for one line over the other.
          </p>
        </div>
      </header>

      <section className="sec">
        <div className="wrap">
          <div className="head">
            <div>
              <div className="eyebrow">{products?.length ?? 0} products</div>
              <h2>{line}</h2>
            </div>
          </div>
          {isLoading && <p>Loading…</p>}
          <div className="grid">
            {products?.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
