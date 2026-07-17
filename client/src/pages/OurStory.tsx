export default function OurStory() {
  return (
    <div>
      <header className="hero" style={{ padding: "76px 0" }}>
        <div className="wrap">
          <div className="eyebrow">Our story</div>
          <h1 style={{ maxWidth: "18ch" }}>Why "Astraea"</h1>
        </div>
      </header>

      <section className="promise">
        <div className="wrap" style={{ maxWidth: 720 }}>
          <p style={{ fontSize: 17, color: "#3c4658", lineHeight: 1.7 }}>
            Astraea was the goddess of purity and justice — the last immortal to walk among humans,
            and the one who refused to abandon truth as the world around her did. When she left, she
            became the constellation Virgo, still watching.
          </p>
          <p style={{ fontSize: 17, color: "#3c4658", lineHeight: 1.7, marginTop: 20 }}>
            We took her name because the supplement industry left truth behind a long time ago:
            blends that hide doses, labels that don't match contents, "tested" claims with nothing
            behind them. Astraea is our way of bringing her back down to earth — every batch tested
            by an independent lab, every result published.
          </p>
          <p style={{ fontSize: 19, fontFamily: "Marcellus,serif", color: "var(--ink)", marginTop: 28 }}>
            We don't ask you to trust us. We show you.
          </p>
        </div>
      </section>

      <section className="sec" style={{ borderTop: "1px solid var(--hair)" }}>
        <div className="wrap">
          <div className="eyebrow">What we stand for</div>
          <h2 style={{ marginBottom: 30 }}>Four things we always come back to</h2>
          <div className="infogrid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="infocard">
              <h4>Verifiable, not claimed</h4>
              <p>
                Everyone says "third-party tested." We publish the actual document for the actual
                batch. The QR that never changes shows every lot — so we can't hand-pick a
                flattering one.
              </p>
            </div>
            <div className="infocard">
              <h4>The right forms, disclosed</h4>
              <p>
                Chelated minerals, active vitamin forms, clinically-studied branded ingredients —
                named on the front, with exact amounts. No "proprietary blend" curtain.
              </p>
            </div>
            <div className="infocard">
              <h4>One cycle, one bottle</h4>
              <p>
                Every product is a 28-day supply — one lunar cycle. It syncs your routine and your
                refill, and it ties the whole line to the goddess in the stars.
              </p>
            </div>
            <div className="infocard">
              <h4>Honest by design</h4>
              <p>
                Independent lab we don't pay by result. Failed batches retired, not sold. The
                structure enforces the promise.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
