import { Link } from "react-router-dom";
import ParticleBackground from "../components/ParticleBackground";

export default function Subscriptions() {
  return (
    <div>
      <header className="hero" style={{ padding: "76px 0" }}>
        <ParticleBackground color="169, 192, 216" className="particles" />
        <div className="wrap">
          <div className="eyebrow">Subscriptions</div>
          <h1 style={{ maxWidth: "18ch" }}>One lunar cycle. One refill.</h1>
          <p className="sub" style={{ maxWidth: "50ch" }}>
            Every Astraea product is a 28-day supply — one full cycle of the moon. Subscribe and
            we ship the next one automatically, right when you'd run out.
          </p>
        </div>
      </header>

      <section className="sec">
        <div className="wrap">
          <div className="infogrid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="infocard">
              <h4>Why 28 days, not 30</h4>
              <p>A real lunar cycle, not an arbitrary round number. It ties your refill rhythm to something consistent instead of a marketing convenience.</p>
            </div>
            <div className="infocard">
              <h4>13 refills a year</h4>
              <p>28-day cycles land you one extra shipment a year compared to a monthly plan — same idea, tighter timing.</p>
            </div>
            <div className="infocard">
              <h4>Save on every subscribed order</h4>
              <p>Subscribing knocks 15% off the one-time price, applied automatically on every recurring shipment.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" style={{ borderTop: "1px solid var(--hair)" }}>
        <div className="wrap">
          <div className="eyebrow">Managing your subscription</div>
          <h2 style={{ marginBottom: 20 }}>Skip, swap, or cancel — no calls, no fine print</h2>
          <p style={{ fontSize: 16, color: "#3c4658", maxWidth: "62ch", lineHeight: 1.7, marginBottom: 20 }}>
            Subscriptions are managed from your account. Skip an upcoming shipment if you still
            have product left, change what's in it, or cancel outright — it takes effect on your
            next cycle, not the one already on its way.
          </p>
          <Link
            to="/account"
            className="btn"
            style={{ display: "inline-block", background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" }}
          >
            Go to your account
          </Link>
        </div>
      </section>

      <section className="sec" style={{ borderTop: "1px solid var(--hair)" }}>
        <div className="wrap">
          <div className="eyebrow">Every shipment, still verified</div>
          <h2 style={{ marginBottom: 20 }}>Subscribing doesn't change the promise</h2>
          <p style={{ fontSize: 16, color: "#3c4658", maxWidth: "62ch", lineHeight: 1.7 }}>
            A subscribed shipment is tested exactly like a one-time order — same independent lab,
            same published COA, same lot-level lookup on{" "}
            <Link to="/lab-tests" style={{ color: "var(--verify)" }}>Lab Tests</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
