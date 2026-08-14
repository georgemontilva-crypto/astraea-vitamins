import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Check } from "lucide-react";
import BottleArt from "./BottleArt";
import { useCart } from "../contexts/CartContext";

export type ProductCardData = {
  id: number;
  handle: string;
  name: string;
  line: "Wellness" | "Sport";
  format: string;
  servingSupply: string | null;
  priceOneTime: string | null;
  imageUrl?: string | null;
  tested?: boolean;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      productName: product.name,
      unitPrice: product.priceOneTime ? parseFloat(product.priceOneTime) : 0,
      priceKnown: !!product.priceOneTime,
      quantity: 1,
      image: product.imageUrl ?? undefined,
      handle: product.handle,
      mode: "one_time",
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <Link className={`card ${product.line.toLowerCase()}`} to={`/products/${product.handle}`}>
      <div className="thumb" style={{ position: "relative" }}>
        <BottleArt name={product.name} line={product.line} format={product.format} />
        <button
          className={`quick-add ${added ? "added" : ""}`}
          onClick={handleQuickAdd}
          aria-label={added ? "Added to cart" : `Add ${product.name} to cart`}
        >
          {added ? <Check size={13} /> : <Plus size={13} />}
        </button>
      </div>
      <div className="meta">
        <div className="line">{product.line}</div>
        <h3>{product.name}</h3>
        <div className="dose">{product.servingSupply}</div>
        <div className="foot">
          <span className="price">{product.priceOneTime ? `$${product.priceOneTime}` : "Price TBD"}</span>
          {product.tested && <span className="tested">TESTED</span>}
        </div>
      </div>
    </Link>
  );
}
