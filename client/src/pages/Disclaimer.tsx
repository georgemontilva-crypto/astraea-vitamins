export default function Disclaimer() {
  return (
    <section className="sec">
      <div className="wrap" style={{ maxWidth: 720 }}>
        <div className="eyebrow">Legal</div>
        <h1 style={{ fontFamily: "Marcellus,serif", fontWeight: 400, fontSize: 34, margin: "8px 0 28px" }}>
          Disclaimer
        </h1>

        <div style={{ fontSize: 15, color: "#3c4658", lineHeight: 1.7 }}>
          <p style={{ marginBottom: 20 }}>
            These statements have not been evaluated by the Food and Drug Administration. This
            product is not intended to diagnose, treat, cure, or prevent any disease.
          </p>
          <p style={{ marginBottom: 20 }}>
            Astraea products are dietary supplements. Statements on this site describe how an
            ingredient supports normal body function — never a claim to treat, cure, prevent, or
            diagnose a disease. If a statement anywhere on this site reads otherwise, it's an
            error, not an intended claim.
          </p>
          <p style={{ marginBottom: 20 }}>
            Consult a physician before use if you are pregnant, nursing, taking medication, or
            under 18. Keep out of reach of children.
          </p>
          <p>
            Lab results published on this site reflect the specific batch tested, as noted by lot
            number. Testing is performed by an independent, third-party laboratory not owned or
            operated by Astraea.
          </p>
        </div>
      </div>
    </section>
  );
}
