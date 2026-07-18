import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMe } from "../lib/useMe";
import { trpc } from "../lib/trpc";

export default function Account() {
  const { user, isLoading, isLoggedIn, refetch } = useMe();
  const navigate = useNavigate();
  const logout = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await refetch();
      navigate("/");
    },
  });

  useEffect(() => {
    if (!isLoading && !isLoggedIn) navigate("/login");
  }, [isLoading, isLoggedIn, navigate]);

  if (isLoading || !user) return <p style={{ padding: 48 }}>Loading…</p>;

  return (
    <section className="sec">
      <div className="wrap" style={{ maxWidth: 560 }}>
        <div className="eyebrow">Account</div>
        <h1 style={{ fontFamily: "Marcellus,serif", fontWeight: 400, fontSize: 34, margin: "8px 0 24px" }}>
          {user.name ? `Hi, ${user.name}` : "Your account"}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>{user.email}</p>

        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontFamily: "Marcellus,serif", fontWeight: 400, fontSize: 20 }}>Order history</h3>
          <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 8 }}>
            No orders yet. Checkout isn't wired to a payment provider yet.
          </p>
        </div>

        <button
          className="btn"
          style={{ marginTop: 32, background: "transparent", color: "var(--ink)", borderColor: "var(--ink)" }}
          onClick={() => logout.mutate()}
        >
          Log out
        </button>
      </div>
    </section>
  );
}
