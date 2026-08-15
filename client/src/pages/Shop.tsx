import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { trpc } from "../lib/trpc";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "Wellness", label: "Wellness" },
  { key: "Sport", label: "Sport" },
  { key: "capsule", label: "Capsules" },
  { key: "tablet", label: "Tablets" },
  { key: "powder", label: "Powders" },
  { key: "stick", label: "Sticks" },
  { key: "gummy", label: "Gummies" },
] as const;

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const active = params.get("line") ?? params.get("format") ?? "all";

  const { data: products, isLoading } = trpc.products.list.useQuery();

  const items =
    active === "all"
      ? products
      : products?.filter((p) => p.line === active || p.format === active);

  function setFilter(key: string) {
    if (key === "all") {
      setParams({});
    } else if (key === "Wellness" || key === "Sport") {
      setParams({ line: key });
    } else {
      setParams({ format: key });
    }
  }

  const title = active === "all" ? "All products" : active;

  return (
    <section className="sec">
      <div className="wrap">
        <div className="head">
          <div>
            <div className="eyebrow">The catalogue</div>
            <h2>{title}</h2>
          </div>
        </div>
        <div className="filters">
          {FILTERS.map((f) => (
            <button key={f.key} className={active === f.key ? "on" : ""} onClick={() => setFilter(f.key)}>
              {f.key === "all" ? `All ${products?.length ?? ""}` : f.label}
            </button>
          ))}
        </div>
        {isLoading && <p>Loading…</p>}
        <div className="grid">
          {items?.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {items && items.length === 0 && <p style={{ color: "var(--muted)" }}>No products match this filter.</p>}
      </div>
    </section>
  );
}
