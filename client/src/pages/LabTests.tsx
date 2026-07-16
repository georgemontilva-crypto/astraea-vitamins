import { useSearchParams } from "react-router-dom";
import { trpc } from "../lib/trpc";

export default function LabTests() {
  const [params] = useSearchParams();
  const productHandle = params.get("product") ?? "";

  const { data, isLoading } = trpc.labTests.batchesForProduct.useQuery(productHandle, {
    enabled: !!productHandle,
  });

  return (
    <div style={{ padding: 24, maxWidth: 880, margin: "0 auto" }}>
      <div className="eyebrow">Lab Tests</div>
      <h1>Check the testing.</h1>

      {/* TODO: port full product + batch dropdown selector, pass/fail banner,
          label-vs-tested table and COA download from
          design-reference/mockups/lab-tests.html (canonical interaction logic) */}

      {isLoading && <p>Loading…</p>}
      {data?.batches.map((b) => (
        <div key={b.id} style={{ border: "1px solid var(--hair)", padding: 16, marginTop: 12 }}>
          <div style={{ fontFamily: "var(--mono)" }}>LOT {b.lot} · {b.pass ? "PASS" : "DID NOT SHIP"}</div>
        </div>
      ))}
    </div>
  );
}
