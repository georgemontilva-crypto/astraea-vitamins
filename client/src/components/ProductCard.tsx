import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    // No price set yet — can't add a real line item, so take them to the PDP instead
    // of silently adding a $0 product.
    if (!product.priceOneTime) {
      navigate(`/products/${product.handle}`);
      return;
    }

    addItem({
      productId: product.id,
      productName: product.name,
      unitPrice: parseFloat(product.priceOneTime),
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
          <span className="tested">TESTED</span>
        </div>
      </div>
    </Link>
  );
}
