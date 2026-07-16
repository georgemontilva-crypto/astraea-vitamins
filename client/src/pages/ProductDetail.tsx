import { useParams, Link } from "react-router-dom";
import { trpc } from "../lib/trpc";

export default function ProductDetail() {
  const { handle } = useParams();
  const { data: product, isLoading } = trpc.products.byHandle.useQuery(handle!, { enabled: !!handle });

  if (isLoading) return <p style={{ padding: 24 }}>Loading…</p>;
  if (!product) return <p style={{ padding: 24 }}>Product not found.</p>;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <div className="eyebrow">{product.line}</div>
      <h1>{product.name}</h1>
      <p style={{ color: "var(--muted)" }}>{product.headline}</p>
      <p>{product.blurb}</p>

      {/* TODO: port Buy box (subscribe vs one-time), Supplement Facts panel
          (strict black-on-white per spec), Free-from tags, "Why this form" block
          and reviews from design-reference/mockups/storefront.html */}

      <Link
        to={`/lab-tests?product=${product.handle}`}
        style={{ color: "var(--verify)", fontFamily: "var(--mono)", fontSize: 13 }}
      >
        Check this product's testing →
      </Link>
    </div>
  );
}
