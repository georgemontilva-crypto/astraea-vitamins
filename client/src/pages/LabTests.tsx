import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { trpc } from "../lib/trpc";

type Panel = { panel: string; claimLimit: string; tested: string; status: string };

export default function LabTests() {
  const [params] = useSearchParams();
  const [productHandle, setProductHandle] = useState(params.get("product") ?? "");
  const [batchIndex, setBatchIndex] = useState<number | null>(null);

  const { data: products } = trpc.products.list.useQuery();
  const { data: labData, isLoading } = trpc.labTests.batchesForProduct.useQuery(productHandle, {
    enabled: !!productHandle,
  });

  // Auto-select the latest batch on the QR deep-link, same as the prototype.
  useEffect(() => {
    if (params.get("product") && labData?.batches.length) {
      setBatchIndex(0);
    }
  }, [labData, params]);

  const batch = batchIndex !== null ? labData?.batches[batchIndex] : undefined;
  const panels = (batch?.panels as Panel[] | null) ?? [];

  return (
    <section className="lab">
      <div className="wrap">
        <div className="eyebrow">Lab Tests</div>
        <h2 style={{ fontFamily: "Marcellus,serif", fontWeight: 400, fontSize: "clamp(28px,4vw,42px)", margin: "10px 0 8px" }}>
          Check the testing.
        </h2>
        <p style={{ maxWidth: "56ch", color: "#3c4658", fontSize: 16 }}>
          Pick a product and your lot number to see its results, or scan the QR on any bottle to
          land here automatically.
        </p>

        <div className="selector">
          <div>
            <label htmlFor="labProduct">Product</label>
            <select
              id="labProduct"
              value={productHandle}
              onChange={(e) => {
                setProductHandle(e.target.value);
                setBatchIndex(null);
              }}
            >
              <option value="">Select a product…</option>
              {products?.map((p) => (
                <option key={p.handle} value={p.handle}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="labBatch">Batch / Lot</label>
            <select
              id="labBatch"
              disabled={!labData?.batches.length}
              value={batchIndex ?? ""}
              onChange={(e) => setBatchIndex(e.target.value === "" ? null : Number(e.target.value))}
            >
              <option value="">
                {productHandle ? "Select a batch…" : "Select product first…"}
              </option>
              {labData?.batches.map((b, i) => (
                <option key={b.id} value={i}>
                  Lot {b.lot} · tested {b.testedAt}{i === 0 ? "  (latest)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading && <p style={{ marginTop: 24 }}>Loading…</p>}

        {productHandle && !isLoading && labData?.batches.length === 0 && (
          <div className="empty">Lab results will publish here at launch.</div>
        )}

        {!batch && productHandle === "" && (
          <div className="empty">Select a product and batch to view its certificate of analysis.</div>
        )}

        {batch && (
          <div className="result show">
            <div className={`banner ${batch.pass ? "" : "fail"}`}>
              <div className="chk">{batch.pass ? "✓" : "!"}</div>
              <span>
                {batch.pass
                  ? `THIS BATCH PASSED ALL TESTING · ${panels.length} OF ${panels.length} PANELS`
                  : "THIS BATCH DID NOT SHIP"}
              </span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Panel</th>
                  <th>Claim / limit</th>
                  <th>Tested</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {panels.map((r, i) => (
                  <tr key={i}>
                    <td>{r.panel}</td>
                    <td className="n">{r.claimLimit}</td>
                    <td className="n">{r.tested}</td>
                    <td><span className="pass">{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
