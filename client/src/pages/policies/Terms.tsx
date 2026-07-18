import PolicyLayout from "../../components/PolicyLayout";

export default function Terms() {
  return (
    <PolicyLayout title="Terms of Service">
      <p>
        Standard terms of sale need a legal pass before this page is final: order acceptance, pricing
        errors, subscription cancellation terms, liability.
      </p>
      <p style={{ marginTop: 14 }}>
        The one claim that's already binding site-wide: these products are dietary supplements. See
        the FDA disclaimer in the footer on every page.
      </p>
    </PolicyLayout>
  );
}
