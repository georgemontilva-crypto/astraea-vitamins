import { Link, NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="nav">
      <div className="wrap">
        <Link className="brand" to="/">ASTRAEA</Link>
        <div className="navlinks">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "on" : "")}>Home</NavLink>
          <NavLink to="/shop" className={({ isActive }) => (isActive ? "on" : "")}>Shop</NavLink>
          <NavLink to="/shop?line=Wellness">Wellness</NavLink>
          <NavLink to="/shop?line=Sport">Sport</NavLink>
          <NavLink to="/lab-tests" className={({ isActive }) => (isActive ? "on" : "")}>Lab Tests</NavLink>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <NavLink to="/account" className={({ isActive }) => (isActive ? "on" : "")} style={{ opacity: 0.75 }}>Account</NavLink>
          <Link className="navcart" to="/shop">Cart · 0</Link>
        </div>
      </div>
    </nav>
  );
}
