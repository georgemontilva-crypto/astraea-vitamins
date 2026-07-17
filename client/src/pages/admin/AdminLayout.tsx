import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useMe } from "../../lib/useMe";
import { trpc } from "../../lib/trpc";
import "../../styles/admin.css";

export default function AdminLayout() {
  const { user, isLoading, isLoggedIn, refetch } = useMe();
  const navigate = useNavigate();
  const logout = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await refetch();
      navigate("/admin/login");
    },
  });

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || user?.role !== "admin")) navigate("/admin/login");
  }, [isLoading, isLoggedIn, user, navigate]);

  if (isLoading || user?.role !== "admin") return <p style={{ padding: 48 }}>Loading…</p>;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand">ASTRAEA · ADMIN</div>
        <NavLink to="/admin/products" className={({ isActive }) => (isActive ? "on" : "")}>Products</NavLink>
        <NavLink to="/admin/categories" className={({ isActive }) => (isActive ? "on" : "")}>Categories</NavLink>
        <NavLink to="/admin/customers" className={({ isActive }) => (isActive ? "on" : "")}>Customers</NavLink>
        <NavLink to="/admin/lab-reports" className={({ isActive }) => (isActive ? "on" : "")}>Lab Reports</NavLink>
        <NavLink to="/admin/images" className={({ isActive }) => (isActive ? "on" : "")}>Site Images</NavLink>
        <button className="logout" onClick={() => logout.mutate()}>Log out ({user.email})</button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
