import { Link } from "react-router-dom";
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../contexts/CartContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, total, itemCount, unpricedCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="cart-backdrop"
            onClick={closeCart}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="cart-drawer"
          >
            <div className="cart-head">
              <div className="cart-head-title">
                <ShoppingBag size={18} />
                <span>Cart</span>
                {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
              </div>
              <button className="cart-close" onClick={closeCart} aria-label="Close cart">
                <X size={18} />
              </button>
            </div>

            <div className="cart-body">
              {items.length === 0 ? (
                <div className="cart-empty">
                  <div className="cart-empty-icon">
                    <ShoppingBag size={24} />
                  </div>
                  <p className="cart-empty-title">Your cart is empty</p>
                  <p className="cart-empty-sub">Add supplements to get started</p>
                  <button className="btn ghost" style={{ borderColor: "var(--ink)", color: "var(--ink)", marginTop: 6 }} onClick={closeCart}>
                    Browse the shop
                  </button>
                </div>
              ) : (
                <div className="cart-items">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="cart-item"
                    >
                      <div className="cart-item-thumb">
                        {item.image ? <img src={item.image} alt={item.productName} /> : <ShoppingBag size={16} />}
                      </div>
                      <div className="cart-item-info">
                        <p className="cart-item-name">{item.productName}</p>
                        <p className="cart-item-mode">{item.mode === "subscribe" ? "Subscribe · every 28 days" : "One-time"}</p>
                        <p className="cart-item-price">
                          {item.priceKnown ? `$${(item.unitPrice * item.quantity).toFixed(2)}` : "Price TBD"}
                        </p>
                      </div>
                      <div className="cart-item-actions">
                        <button className="cart-item-remove" onClick={() => removeItem(item.id)} aria-label="Remove">
                          <Trash2 size={13} />
                        </button>
                        <div className="cart-qty">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">
                            <Minus size={12} />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="cart-foot">
                <div className="cart-subtotal">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <p className="cart-subtotal-note">
                  {unpricedCount > 0
                    ? `Shipping and taxes calculated at checkout · ${unpricedCount} item${unpricedCount !== 1 ? "s" : ""} still pending pricing`
                    : "Shipping and taxes calculated at checkout"}
                </p>
                <Link to="/checkout" className="btn" style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: 8, background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" }} onClick={closeCart}>
                  Proceed to checkout <ArrowRight size={16} />
                </Link>
                <button className="btn ghost" style={{ width: "100%", borderColor: "var(--ink)", color: "var(--ink)", marginTop: 8 }} onClick={closeCart}>
                  Continue shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
