import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useSearchParams } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useCart } from "../contexts/CartContext";

export default function Nav() {
  const location = useLocation();
  const [params] = useSearchParams();
  const line = params.get("line");
  const { itemCount, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const onShop = location.pathname === "/shop" || location.pathname.startsWith("/products/");
  const onWellness = onShop && line === "Wellness";
  const onSport = onShop && line === "Sport";
  const onShopRoot = onShop && !line;

  // Close the mobile menu whenever the route changes (link clicks, back/forward).
  useEffect(() => setMobileOpen(false), [location.pathname, location.search]);

  return (
    <nav className="nav">
      <div className="wrap">
        <Link className="brand" to="/">ASTRAEA</Link>

        <div className="navlinks">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "on" : "")}>Home</NavLink>
          <div className="navdrop">
            <NavLink to="/shop" className={onShop ? "on" : ""}>
              Shop <span className="caret">▾</span>
            </NavLink>
            <div className="navdrop-panel">
              <Link to="/shop" className={onShopRoot ? "on" : ""}>All products</Link>
              <Link to="/shop?line=Wellness" className={onWellness ? "on" : ""}>Wellness</Link>
              <Link to="/shop?line=Sport" className={onSport ? "on" : ""}>Sport</Link>
            </div>
          </div>
          <NavLink to="/lab-tests" className={({ isActive }) => (isActive ? "on" : "")}>Lab Tests</NavLink>
          <NavLink to="/our-story" className={({ isActive }) => (isActive ? "on" : "")}>Our Story</NavLink>
          <NavLink to="/account" className={({ isActive }) => (isActive ? "on" : "")}>Account</NavLink>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="navcart" onClick={openCart}>Cart · {itemCount}</button>
          <button
            className="nav-toggle"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="nav-mobile-panel">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "on" : "")}>Home</NavLink>
          <NavLink to="/shop" className={onShopRoot ? "on" : ""}>All products</NavLink>
          <Link to="/shop?line=Wellness" className={onWellness ? "on" : ""}>Wellness</Link>
          <Link to="/shop?line=Sport" className={onSport ? "on" : ""}>Sport</Link>
          <NavLink to="/lab-tests" className={({ isActive }) => (isActive ? "on" : "")}>Lab Tests</NavLink>
          <NavLink to="/our-story" className={({ isActive }) => (isActive ? "on" : "")}>Our Story</NavLink>
          <NavLink to="/account" className={({ isActive }) => (isActive ? "on" : "")}>Account</NavLink>
        </div>
      )}
    </nav>
  );
}
