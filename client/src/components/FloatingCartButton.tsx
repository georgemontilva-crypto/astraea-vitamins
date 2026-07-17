import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../contexts/CartContext";

const FADE_MS = 250;

export default function FloatingCartButton() {
  const { itemCount, openCart } = useCart();
  const location = useLocation();

  // Checkout is a focused, single-task flow — a floating "buy more" button
  // doesn't belong there. Admin uses a completely different layout (no
  // storefront nav/cart), so it doesn't belong there either.
  const hiddenRoute = location.pathname.startsWith("/checkout") || location.pathname.startsWith("/admin");
  const shouldShow = itemCount > 0 && !hiddenRoute;

  const [mounted, setMounted] = useState(shouldShow);
  const [animateIn, setAnimateIn] = useState(shouldShow);

  useEffect(() => {
    if (shouldShow) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setAnimateIn(true));
      return () => cancelAnimationFrame(raf);
    }
    setAnimateIn(false);
    const t = setTimeout(() => setMounted(false), FADE_MS);
    return () => clearTimeout(t);
  }, [shouldShow]);

  if (!mounted) return null;

  return (
    <button
      onClick={openCart}
      aria-label={`Open cart (${itemCount} item${itemCount !== 1 ? "s" : ""})`}
      className="floating-cart"
      style={{
        opacity: animateIn ? 1 : 0,
        transform: animateIn ? "scale(1)" : "scale(0.75)",
        transitionDuration: `${FADE_MS}ms`,
      }}
    >
      <span className="floating-cart-ring" />
      <ShoppingBag size={22} className="floating-cart-icon" />
      {itemCount > 0 && <span className="floating-cart-badge">{itemCount > 99 ? "99+" : itemCount}</span>}
    </button>
  );
}
