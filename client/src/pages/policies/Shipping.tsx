import PolicyLayout from "../../components/PolicyLayout";

export default function Shipping() {
  return (
    <PolicyLayout title="Shipping & Returns">
      <p>
        Shipping rates, timelines, and the return/refund window for Astraea orders will go here
        once the fulfillment provider and carrier are finalized.
      </p>
      <p style={{ marginTop: 14 }}>
        In the meantime: if something arrives damaged or wrong, use the <a href="/contact" style={{ color: "var(--verify)" }}>contact form</a> and
        we'll sort it out directly.
      </p>
    </PolicyLayout>
  );
}
