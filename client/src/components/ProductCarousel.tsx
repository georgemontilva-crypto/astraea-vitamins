import { useEffect, useRef, useState } from "react";
import ProductCard, { ProductCardData } from "./ProductCard";

export default function ProductCarousel({ products }: { products: ProductCardData[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function onScroll() {
      if (!el) return;
      const idx = Math.round(el.scrollLeft / Math.max(el.clientWidth, 1));
      setActive(idx);
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  function goTo(i: number) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div>
      <div className="grid essentials-scroll" ref={scrollRef}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <div className="essentials-dots">
        {products.map((_, i) => (
          <button
            key={i}
            className={i === active ? "on" : ""}
            onClick={() => goTo(i)}
            aria-label={`Go to product ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
