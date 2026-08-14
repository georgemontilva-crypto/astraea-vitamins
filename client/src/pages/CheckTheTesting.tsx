import { Link } from "react-router-dom";
import ParticleBackground from "../components/ParticleBackground";

export default function CheckTheTesting() {
  return (
    <div>
      <header className="hero" style={{ padding: "76px 0" }}>
        <ParticleBackground color="169, 192, 216" className="particles" />
        <div className="wrap">
          <div className="eyebrow">Check the Testing</div>
          <h1 style={{ maxWidth: "20ch" }}>What "tested" actually means here.</h1>
          <p className="sub" style={{ maxWidth: "50ch" }}>
            Every Astraea batch goes to an independent lab before it ships. This page explains the
            system. To see one product's actual results, head to{" "}
            <Link to="/lab-tests" style={{ color: "var(--star)", textDecoration: "underline" }}>
              Lab Tests
            </Link>
            .
          </p>
        </div>
      </header>

      <section className="sec">
        <div className="wrap">
          <div className="eyebrow">What we test</div>
          <h2 style={{ marginBottom: 30 }}>Every lot, five kinds of panels</h2>
          <div className="infogrid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="infocard">
              <h4>Identity</h4>
              <p>Confirms the ingredient in the bottle is actually the ingredient on the label — not a substitute or filler standing in for it.</p>
            </div>
            <div className="infocard">
              <h4>Potency</h4>
              <p>Measures the active amount against the label claim, so the dose you're taking matches the dose you're reading.</p>
            </div>
            <div className="infocard">
              <h4>Heavy metals</h4>
              <p>Lead, arsenic, cadmium, and mercury, checked against USP limits.</p>
            </div>
            <div className="infocard">
              <h4>Microbials</h4>
              <p>Yeast, mold, E. coli, and salmonella — confirming the product is clean to consume.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" style={{ borderTop: "1px solid var(--hair)" }}>
        <div className="wrap">
          <div className="eyebrow">Which lab</div>
          <h2 style={{ marginBottom: 20 }}>Independent, and not on our payroll</h2>
          <p style={{ fontSize: 16, color: "#3c4658", maxWidth: "62ch", lineHeight: 1.7 }}>
            Testing is performed by a third-party, ISO 17025-accredited laboratory. Astraea doesn't
            own the lab, run it, or pay it based on results — the same fee applies whether a batch
            passes or fails. That separation is what makes a "PASS" mean something.
          </p>
        </div>
      </section>

      <section className="sec" style={{ borderTop: "1px solid var(--hair)" }}>
        <div className="wrap">
          <div className="eyebrow">How to read a COA</div>
          <h2 style={{ marginBottom: 20 }}>Three things to look at</h2>
          <div className="infogrid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="infocard">
              <h4>The lot number</h4>
              <p>Match it to the code stamped on your pack. A COA is only meaningful for the exact lot it was tested from.</p>
            </div>
            <div className="infocard">
              <h4>Claim vs. tested</h4>
              <p>Every panel shows what the label claims next to what the lab actually measured — side by side, not just a pass/fail stamp.</p>
            </div>
            <div className="infocard">
              <h4>The status</h4>
              <p>PASS means within spec on every panel. If a batch fails any panel, it doesn't ship — full stop.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="testband">
        <div className="wrap">
          <div className="eyebrow">Ready to check one</div>
          <h2>Pick a product and see its real results.</h2>
          <p>Every published batch, sorted newest first, with the certificate to download.</p>
          <Link
            to="/lab-tests"
            className="btn"
            style={{ display: "inline-block", marginTop: 18, background: "var(--paper)", color: "var(--ink)", borderColor: "var(--paper)" }}
          >
            Go to Lab Tests
          </Link>
        </div>
      </section>
    </div>
  );
}
