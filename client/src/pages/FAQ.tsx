import { Link } from "react-router-dom";

const FAQS: { category: string; qa: { q: string; a: React.ReactNode }[] }[] = [
  {
    category: "Testing",
    qa: [
      {
        q: "What does 'tested' mean on an Astraea product?",
        a: "Every batch is sent to an independent, ISO 17025-accredited lab before it ships. If it fails any panel, it doesn't ship. See the full breakdown on Check the Testing.",
      },
      {
        q: "How do I find my batch's actual results?",
        a: (
          <>
            Scan the QR on your bottle, or go to <Link to="/lab-tests" style={{ color: "var(--verify)" }}>Lab Tests</Link> and
            pick your product and lot number from the dropdown.
          </>
        ),
      },
      {
        q: "What if a batch fails testing?",
        a: "It doesn't ship, and the lot number is retired. Failed batches aren't published — there's nothing to hide because there's nothing on shelves to see.",
      },
    ],
  },
  {
    category: "Subscriptions",
    qa: [
      {
        q: "Why 28 days instead of 30?",
        a: "One full lunar cycle, not a rounded-off month. See Subscriptions for the full explanation.",
      },
      {
        q: "Can I skip or cancel a shipment?",
        a: (
          <>
            Yes, anytime from your <Link to="/account" style={{ color: "var(--verify)" }}>account</Link> — changes apply
            to your next cycle, not one already shipping.
          </>
        ),
      },
    ],
  },
  {
    category: "Shipping & Returns",
    qa: [
      {
        q: "What are your shipping rates and timelines?",
        a: (
          <>
            Not finalized yet — see <Link to="/shipping" style={{ color: "var(--verify)" }}>Shipping &amp; Returns</Link> for
            the current status.
          </>
        ),
      },
      {
        q: "What if something arrives wrong or damaged?",
        a: (
          <>
            Use the <Link to="/contact" style={{ color: "var(--verify)" }}>contact form</Link> and we'll sort it out
            directly.
          </>
        ),
      },
    ],
  },
];

export default function FAQ() {
  return (
    <section className="sec">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <div className="eyebrow">FAQ</div>
        <h1 style={{ fontFamily: "Marcellus,serif", fontWeight: 400, fontSize: 34, margin: "8px 0 36px" }}>
          Frequently asked questions
        </h1>

        {FAQS.map((section) => (
          <div key={section.category} style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: "Marcellus,serif", fontWeight: 400, fontSize: 20, marginBottom: 14 }}>
              {section.category}
            </h2>
            <div style={{ border: "1px solid var(--hair)", borderRadius: "var(--radius)", overflow: "hidden", background: "#fff" }}>
              {section.qa.map((item, i) => (
                <details key={i} style={{ borderBottom: i < section.qa.length - 1 ? "1px solid var(--hair)" : "none" }}>
                  <summary
                    style={{
                      padding: "16px 20px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 15,
                      listStyle: "none",
                    }}
                  >
                    {item.q}
                  </summary>
                  <div style={{ padding: "0 20px 18px", color: "#3c4658", fontSize: 14.5, lineHeight: 1.6 }}>{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
