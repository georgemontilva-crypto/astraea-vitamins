import { Link } from "react-router-dom";
import BottleArt from "./BottleArt";

export type ProductCardData = {
  handle: string;
  name: string;
  line: "Wellness" | "Sport";
  format: string;
  servingSupply: string | null;
  priceOneTime: string | null;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link className={`card ${product.line.toLowerCase()}`} to={`/products/${product.handle}`}>
      <div className="thumb">
        <BottleArt name={product.name} line={product.line} format={product.format} />
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
