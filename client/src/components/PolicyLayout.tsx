export default function PolicyLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="sec">
      <div className="wrap" style={{ maxWidth: 720 }}>
        <div className="eyebrow">Policies</div>
        <h1 style={{ fontFamily: "Marcellus,serif", fontWeight: 400, fontSize: 34, margin: "8px 0 24px" }}>
          {title}
        </h1>
        <div style={{ fontSize: 15, color: "#3c4658", lineHeight: 1.7 }}>{children}</div>
        <div
          style={{
            marginTop: 32,
            background: "#fbf3e8",
            border: "1px solid #e6cfa8",
            borderRadius: "var(--radius)",
            padding: "16px 20px",
            fontSize: 13.5,
            color: "#6b4e23",
          }}
        >
          This page hasn't been finalized with legal/compliance review yet. Treat it as a
          placeholder, not a published policy.
        </div>
      </div>
    </section>
  );
}
