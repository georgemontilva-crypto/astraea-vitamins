import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../../lib/trpc";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notAdminError, setNotAdminError] = useState(false);
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const logout = trpc.auth.logout.useMutation();
  const login = trpc.auth.login.useMutation({
    onSuccess: async (data) => {
      if (data.role !== "admin") {
        setNotAdminError(true);
        await logout.mutateAsync(); // don't leave a customer session sitting around on /admin
        return;
      }
      await utils.auth.me.invalidate();
      navigate("/admin");
    },
  });

  return (
    <section className="sec" style={{ background: "var(--ink)", minHeight: "60vh" }}>
      <div className="wrap" style={{ maxWidth: 380 }}>
        <div className="eyebrow" style={{ color: "var(--star)" }}>Astraea Admin</div>
        <h1 style={{ fontFamily: "Marcellus,serif", fontWeight: 400, fontSize: 30, margin: "8px 0 24px", color: "var(--paper)" }}>
          Sign in
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setNotAdminError(false);
            login.mutate({ email, password });
          }}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <input
            type="email"
            placeholder="admin@astraeavitamins.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "13px 14px", border: "1px solid var(--hair)", fontFamily: "Karla,sans-serif", fontSize: 15 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "13px 14px", border: "1px solid var(--hair)", fontFamily: "Karla,sans-serif", fontSize: 15 }}
          />
          {(login.isError || notAdminError) && (
            <p style={{ color: "#ff8a75", fontSize: 13.5 }}>
              {notAdminError ? "This account doesn't have admin access." : login.error?.message}
            </p>
          )}
          <button className="btn" type="submit" disabled={login.isPending}>
            {login.isPending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}
