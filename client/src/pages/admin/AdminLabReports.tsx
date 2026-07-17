import { useState } from "react";
import { trpc } from "../../lib/trpc";
import { uploadFile } from "../../lib/upload";

type PanelRow = { panel: string; claimLimit: string; tested: string; status: string };

const emptyPanel: PanelRow = { panel: "", claimLimit: "", tested: "", status: "PASS" };

export default function AdminLabReports() {
  const utils = trpc.useUtils();
  const { data: batches, isLoading } = trpc.admin.batches.listAll.useQuery();
  const { data: products } = trpc.admin.products.listAll.useQuery();
  const publish = trpc.admin.batches.publish.useMutation({ onSuccess: () => utils.admin.batches.listAll.invalidate() });
  const unpublish = trpc.admin.batches.unpublish.useMutation({ onSuccess: () => utils.admin.batches.listAll.invalidate() });
  const create = trpc.admin.batches.create.useMutation({
    onSuccess: () => {
      utils.admin.batches.listAll.invalidate();
      resetForm();
    },
  });

  const [showForm, setShowForm] = useState(false);
  const [productId, setProductId] = useState<number | "">("");
  const [lot, setLot] = useState("");
  const [testedAt, setTestedAt] = useState("");
  const [bestBy, setBestBy] = useState("");
  const [pass, setPass] = useState(true);
  const [labName, setLabName] = useState("");
  const [coaPdfUrl, setCoaPdfUrl] = useState("");
  const [uploadingCoa, setUploadingCoa] = useState(false);
  const [panels, setPanels] = useState<PanelRow[]>([{ ...emptyPanel }]);

  function resetForm() {
    setShowForm(false);
    setProductId("");
    setLot("");
    setTestedAt("");
    setBestBy("");
    setPass(true);
    setLabName("");
    setCoaPdfUrl("");
    setPanels([{ ...emptyPanel }]);
  }

  async function handleCoaUpload(file: File) {
    setUploadingCoa(true);
    try {
      const product = products?.find((p) => p.id === productId);
      const { url } = await uploadFile(file, `coa/${product?.handle ?? "misc"}`);
      setCoaPdfUrl(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingCoa(false);
    }
  }

  function productName(id: number) {
    return products?.find((p) => p.id === id)?.name ?? `#${id}`;
  }

  if (isLoading) return <p>Loading…</p>;

  return (
    <div>
      <h1>Lab Reports ({batches?.length ?? 0})</h1>

      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showForm ? 14 : 0 }}>
          <h2 style={{ margin: 0 }}>Add batch / COA</h2>
          <button className="admin-btn ghost" onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancel" : "+ New batch"}
          </button>
        </div>

        {showForm && (
          <form
            className="admin-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!productId) return;
              create.mutate({
                productId,
                lot,
                testedAt,
                bestBy,
                pass,
                labName,
                coaPdfUrl: coaPdfUrl || undefined,
                panels: panels.filter((p) => p.panel.trim() !== ""),
              });
            }}
          >
            <div>
              <label>Product</label>
              <select required value={productId} onChange={(e) => setProductId(Number(e.target.value))}>
                <option value="">Select…</option>
                {products?.map((p) => (
                  <option key={p.id} value={p.id}>{p.sku} — {p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Lot number</label>
              <input required value={lot} onChange={(e) => setLot(e.target.value)} placeholder="26-0114" />
            </div>
            <div>
              <label>Tested date</label>
              <input value={testedAt} onChange={(e) => setTestedAt(e.target.value)} placeholder="03 FEB 2026" />
            </div>
            <div>
              <label>Best by</label>
              <input value={bestBy} onChange={(e) => setBestBy(e.target.value)} placeholder="JAN 2028" />
            </div>
            <div>
              <label>Lab name</label>
              <input value={labName} onChange={(e) => setLabName(e.target.value)} placeholder="Accredited lab name" />
            </div>
            <div>
              <label>Result</label>
              <select value={pass ? "pass" : "fail"} onChange={(e) => setPass(e.target.value === "pass")}>
                <option value="pass">PASS</option>
                <option value="fail">FAIL (won't ship)</option>
              </select>
            </div>
            <div className="full">
              <label>Certificate of Analysis (PDF)</label>
              <input type="file" accept="application/pdf" disabled={!productId} onChange={(e) => e.target.files?.[0] && handleCoaUpload(e.target.files[0])} />
              {uploadingCoa && <span style={{ fontSize: 12, color: "var(--muted)" }}> Uploading…</span>}
              {coaPdfUrl && <div style={{ fontSize: 12, color: "var(--verify)", marginTop: 4 }}>✓ Uploaded</div>}
            </div>

            <div className="full">
              <label>Test panels</label>
              {panels.map((row, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr auto", gap: 6, marginBottom: 6 }}>
                  <input
                    placeholder="Panel (e.g. Potency HPLC)"
                    value={row.panel}
                    onChange={(e) => setPanels((p) => p.map((r, idx) => (idx === i ? { ...r, panel: e.target.value } : r)))}
                  />
                  <input
                    placeholder="Claim / limit"
                    value={row.claimLimit}
                    onChange={(e) => setPanels((p) => p.map((r, idx) => (idx === i ? { ...r, claimLimit: e.target.value } : r)))}
                  />
                  <input
                    placeholder="Tested result"
                    value={row.tested}
                    onChange={(e) => setPanels((p) => p.map((r, idx) => (idx === i ? { ...r, tested: e.target.value } : r)))}
                  />
                  <input
                    placeholder="Status"
                    value={row.status}
                    onChange={(e) => setPanels((p) => p.map((r, idx) => (idx === i ? { ...r, status: e.target.value } : r)))}
                  />
                  <button
                    type="button"
                    className="admin-btn danger"
                    onClick={() => setPanels((p) => p.filter((_, idx) => idx !== i))}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button type="button" className="admin-btn ghost" onClick={() => setPanels((p) => [...p, { ...emptyPanel }])}>
                + Add panel row
              </button>
            </div>

            <div className="full">
              <button className="admin-btn" type="submit" disabled={create.isPending}>
                {create.isPending ? "Saving…" : "Save batch (unpublished)"}
              </button>
              {create.isError && <span style={{ color: "#8c2f22", marginLeft: 12, fontSize: 13 }}>{create.error.message}</span>}
            </div>
          </form>
        )}
      </div>

      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>
        A batch only appears on the public Lab Tests page once published. Failed batches can't be published.
      </p>

      <div className="admin-card admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Lot</th>
              <th>Product</th>
              <th>Tested</th>
              <th>Result</th>
              <th>COA</th>
              <th>Published</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {batches?.map((b) => (
              <tr key={b.id}>
                <td className="n">{b.lot}</td>
                <td>{productName(b.productId)}</td>
                <td className="n">{b.testedAt}</td>
                <td>
                  <span className="pass" style={!b.pass ? { color: "#8c2f22", borderColor: "#8c2f22" } : {}}>
                    {b.pass ? "PASS" : "FAIL"}
                  </span>
                </td>
                <td>{b.coaPdfUrl ? <a href={b.coaPdfUrl} target="_blank" rel="noreferrer">View</a> : "—"}</td>
                <td>{b.published ? "✓" : "—"}</td>
                <td>
                  {b.published ? (
                    <button className="admin-btn ghost" onClick={() => unpublish.mutate(b.id)}>Unpublish</button>
                  ) : (
                    <button className="admin-btn" onClick={() => publish.mutate(b.id)} disabled={!b.pass}>Publish</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
