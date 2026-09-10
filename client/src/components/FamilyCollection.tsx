import ProductCard from "./ProductCard";
import { trpc } from "../lib/trpc";

/**
 * Wave-one navigation is by formula family (Daily Shake, Sleep Gummy) plus a
 * variety surface — see section 3 of the 2026-08-26 rescope. The Wellness/Sport
 * line pages still exist unpublished for later waves; this is a parallel
 * surface, not a replacement, so neither one has to be rebuilt when the full
 * catalog returns.
 */
export default function FamilyCollection({
  family,
  varietyOnly,
  title,
  eyebrow,
  tagline,
  gradient,
}: {
  family?: string;
  varietyOnly?: boolean;
  title: string;
  eyebrow: string;
  tagline: string;
  gradient: string;
}) {
  const { data: products, isLoading } = trpc.products.list.useQuery({ family, varietyOnly });

  return (
    <div>
      <header className="hero" style={{ background: gradient }}>
        <div className="wrap" style={{ padding: "76px 32px" }}>
          <div className="eyebrow">{eyebrow}</div>
          <h1 style={{ maxWidth: "18ch" }}>{title}</h1>
          <p className="sub" style={{ maxWidth: "50ch" }}>{tagline}</p>
        </div>
      </header>

      <section className="sec">
        <div className="wrap">
          <div className="head">
            <div>
              <div className="eyebrow">{products?.length ?? 0} products</div>
              <h2>{title}</h2>
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
