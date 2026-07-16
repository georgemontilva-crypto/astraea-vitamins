import { trpc } from "../lib/trpc";
import { Link } from "react-router-dom";

export default function Shop() {
  const { data: products, isLoading } = trpc.products.list.useQuery();

  return (
    <div style={{ padding: 24 }}>
      <div className="eyebrow">Shop</div>
      <h1>All products</h1>
      {isLoading && <p>Loading…</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16, marginTop: 24 }}>
        {products?.map((p) => (
          <Link
            key={p.id}
            to={`/products/${p.handle}`}
            style={{
              background: "var(--paper2)",
              border: "1px solid var(--hair)",
              padding: 16,
              textDecoration: "none",
              color: "var(--ink)",
            }}
          >
            <div className="eyebrow" style={{ color: p.line === "Wellness" ? "var(--starDark)" : "var(--ember)" }}>
              {p.line}
            </div>
            <h3>{p.name}</h3>
            <div style={{ fontFamily: "var(--mono)", fontSize: 13 }}>{p.servingSupply}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
