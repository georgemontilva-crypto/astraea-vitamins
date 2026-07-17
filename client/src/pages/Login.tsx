import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { trpc } from "../lib/trpc";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const login = trpc.auth.login.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      navigate("/account");
    },
  });

  return (
    <section className="sec">
      <div className="wrap" style={{ maxWidth: 420 }}>
        <div className="eyebrow">Account</div>
        <h1 style={{ fontFamily: "Marcellus,serif", fontWeight: 400, fontSize: 34, margin: "8px 0 24px" }}>
          Log in
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login.mutate({ email, password });
          }}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <input
            type="email"
            placeholder="you@email.com"
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
          {login.isError && (
            <p style={{ color: "#8c2f22", fontSize: 13.5 }}>{login.error.message}</p>
          )}
          <button className="btn" type="submit" style={{ background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" }} disabled={login.isPending}>
            {login.isPending ? "Logging in…" : "Log in"}
          </button>
        </form>
        <p style={{ marginTop: 16, fontSize: 13.5, color: "var(--muted)" }}>
          No account yet? <Link to="/register" style={{ color: "var(--verify)" }}>Create one</Link>
        </p>
      </div>
    </section>
  );
}
