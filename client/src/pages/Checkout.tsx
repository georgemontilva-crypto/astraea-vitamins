import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export default function Checkout() {
  const { items, total, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <section className="sec">
        <div className="wrap" style={{ maxWidth: 560, textAlign: "center" }}>
          <div className="eyebrow">Checkout</div>
          <h1 style={{ fontFamily: "Marcellus,serif", fontWeight: 400, fontSize: 30, margin: "8px 0 16px" }}>
            Your cart is empty
          </h1>
          <Link className="btn" to="/shop" style={{ background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" }}>
            Browse the shop
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="sec">
      <div className="wrap" style={{ maxWidth: 640 }}>
        <div className="eyebrow">Checkout</div>
        <h1 style={{ fontFamily: "Marcellus,serif", fontWeight: 400, fontSize: 30, margin: "8px 0 20px" }}>
          Order summary
        </h1>

        <div style={{ border: "1px solid var(--hair)", borderRadius: "var(--radius)", overflow: "hidden", background: "#fff" }}>
          {items.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: "1px solid var(--hair)" }}>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 600 }}>{item.productName}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--muted)" }}>
                  {item.mode === "subscribe" ? "Subscribe · every 28 days" : "One-time"} · Qty {item.quantity}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 14 }}>
                  {item.priceKnown ? `$${(item.unitPrice * item.quantity).toFixed(2)}` : "Price TBD"}
                </span>
                <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", color: "#8c2f22", fontSize: 12, cursor: "pointer" }}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 18px", fontFamily: "var(--mono)", fontSize: 16 }}>
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div
          style={{
            marginTop: 20,
            background: "#fbf3e8",
            border: "1px solid #e6cfa8",
            borderRadius: "var(--radius)",
            padding: "16px 20px",
            fontSize: 13.5,
            color: "#6b4e23",
          }}
        >
          There's no payment provider connected yet. This is a real cart, but checkout can't take a
          payment until that's wired up. Your items stay in the cart for now.
        </div>

        <Link to="/shop" style={{ display: "inline-block", marginTop: 20, color: "var(--verify)", fontFamily: "var(--mono)", fontSize: 13 }}>
          ← Continue shopping
        </Link>
      </div>
    </section>
  );
}
