import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { trpc } from "../lib/trpc";

type Panel = { panel: string; claimLimit: string; tested: string; status: string };

export default function LabTests() {
  // Two ways in: the printed QR lands on /lab/<handle>, and the pre-rescope
  // links used /lab-tests?product=<handle>. The server 301s the second shape to
  // the first, but the param is still read here so a direct client-side render
  // (no round trip) also resolves.
  const { handle: routeHandle } = useParams<{ handle: string }>();
  const [params] = useSearchParams();
  const deepLinked = routeHandle ?? params.get("product") ?? "";

  const [productHandle, setProductHandle] = useState(deepLinked);
  const [flavorHandle, setFlavorHandle] = useState<string>("");
  const [batchIndex, setBatchIndex] = useState<number | null>(null);

  const { data: products } = trpc.products.list.useQuery();
  const { data: labData, isLoading } = trpc.labTests.batchesForProduct.useQuery(productHandle, {
    enabled: !!productHandle,
  });

  // Keep the selector in sync when the URL itself changes (QR scanned while
  // the page is already open, browser back/forward between two /lab/ URLs).
  useEffect(() => {
    if (deepLinked && deepLinked !== productHandle) {
      setProductHandle(deepLinked);
      setFlavorHandle("");
      setBatchIndex(null);
    }
  }, [deepLinked]); // eslint-disable-line react-hooks/exhaustive-deps

  const groups = labData?.groups ?? [];
  const isVariety = !!labData?.isVarietyPack;

  // Single-flavor SKU: there is only ever one group, so select it silently and
  // show the batch dropdown alone. A variety pack needs the flavor picked first.
  const activeGroup = isVariety ? groups.find((g) => g.handle === flavorHandle) : groups[0];

  useEffect(() => {
    if (!labData) return;
    if (!isVariety && deepLinked && groups[0]?.batches.length) {
      setBatchIndex(0); // deep link straight to the latest lot, as the prototype did
    }
  }, [labData, isVariety, deepLinked, groups]);

  const batch = batchIndex !== null ? activeGroup?.batches[batchIndex] : undefined;
  const panels = (batch?.panels as Panel[] | null) ?? [];
  const noLotsYet = !!productHandle && !isLoading && groups.every((g) => g.batches.length === 0);

  return (
    <section className="lab">
      <div className="wrap">
        <div className="eyebrow">Lab Tests</div>
        <h2 style={{ fontFamily: "Marcellus,serif", fontWeight: 400, fontSize: "clamp(28px,4vw,42px)", margin: "10px 0 8px" }}>
          Check the testing.
        </h2>
        <p style={{ maxWidth: "56ch", color: "#3c4658", fontSize: 16 }}>
          Pick a product and your lot number to see its results, or scan the QR on any carton,
          sachet or pouch to land here automatically.
        </p>

        <div className="selector">
          <div>
            <label htmlFor="labProduct">Product</label>
            <select
              id="labProduct"
              value={productHandle}
              onChange={(e) => {
                setProductHandle(e.target.value);
                setFlavorHandle("");
                setBatchIndex(null);
              }}
            >
              <option value="">Select a product…</option>
              {products?.map((p) => (
                <option key={p.handle} value={p.handle}>{p.name}</option>
              ))}
            </select>
          </div>

          {isVariety && (
            <div>
              <label htmlFor="labFlavor">Flavor in this carton</label>
              <select
                id="labFlavor"
                value={flavorHandle}
                onChange={(e) => {
                  setFlavorHandle(e.target.value);
                  setBatchIndex(null);
                }}
              >
                <option value="">Select a flavor…</option>
                {groups.map((g) => (
                  <option key={g.handle} value={g.handle}>
                    {g.name}{g.batches.length === 0 ? " — no published lots yet" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="labBatch">Batch / Lot</label>
            <select
              id="labBatch"
              disabled={!activeGroup?.batches.length}
              value={batchIndex ?? ""}
              onChange={(e) => setBatchIndex(e.target.value === "" ? null : Number(e.target.value))}
            >
              <option value="">
                {!productHandle
                  ? "Select product first…"
                  : isVariety && !flavorHandle
                  ? "Select flavor first…"
                  : "Select a batch…"}
              </option>
              {activeGroup?.batches.map((b, i) => (
                <option key={b.id} value={i}>
                  Lot {b.lot} · tested {b.testedAt}{i === 0 ? "  (latest)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isVariety && (
          <p style={{ marginTop: 14, color: "#3c4658", fontSize: 14, maxWidth: "56ch" }}>
            A variety pack carton holds every flavor in its family, and each flavor is tested as
            its own lot. Your lot number is printed on the individual sachet or pouch, not on the
            outer carton.
          </p>
        )}

        {isLoading && <p style={{ marginTop: 24 }}>Loading…</p>}

        {noLotsYet && <div className="empty">Lab results will publish here at launch.</div>}

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
