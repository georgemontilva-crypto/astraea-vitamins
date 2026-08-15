import { useState } from "react";
import { trpc } from "../../lib/trpc";
import { uploadFile } from "../../lib/upload";

type Edit = { stock?: string; priceOneTime?: string; priceSubscribe?: string; familyKey?: string };

export default function AdminProducts() {
  const utils = trpc.useUtils();
  const { data: products, isLoading } = trpc.admin.products.listAll.useQuery();
  const { data: categories } = trpc.admin.categories.list.useQuery();
  const update = trpc.admin.products.update.useMutation({ onSuccess: () => utils.admin.products.listAll.invalidate() });
  const remove = trpc.admin.products.remove.useMutation({ onSuccess: () => utils.admin.products.listAll.invalidate() });
  const create = trpc.admin.products.create.useMutation({
    onSuccess: () => {
      utils.admin.products.listAll.invalidate();
      setShowForm(false);
    },
  });

  const [edits, setEdits] = useState<Record<number, Edit>>({});
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    handle: "",
    sku: "",
    name: "",
    line: "Wellness" as "Wellness" | "Sport",
    category: "Core",
    format: "capsule" as "capsule" | "tablet" | "powder" | "stick" | "gummy",
    servingSupply: "",
    headline: "",
    blurb: "",
  });

  async function handleImageUpload(id: number, handle: string, file: File) {
    setUploadingId(id);
    try {
      const { url } = await uploadFile(file, `products/${handle}`);
      await update.mutateAsync({ id, imageUrl: url });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingId(null);
    }
  }

  if (isLoading) return <p>Loading…</p>;

  return (
    <div>
      <h1>Products ({products?.length ?? 0})</h1>

      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showForm ? 14 : 0 }}>
          <h2 style={{ margin: 0 }}>Add product</h2>
          <button className="admin-btn ghost" onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancel" : "+ New product"}
          </button>
        </div>
        {showForm && (
          <form
            className="admin-form"
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate(form);
            }}
          >
            <div>
              <label>SKU code</label>
              <input required value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} placeholder="AST-38" />
            </div>
            <div>
              <label>Handle (URL slug)</label>
              <input required value={form.handle} onChange={(e) => setForm((f) => ({ ...f, handle: e.target.value }))} placeholder="new-product-name" />
            </div>
            <div className="full">
              <label>Name</label>
              <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label>Line</label>
              <select value={form.line} onChange={(e) => setForm((f) => ({ ...f, line: e.target.value as "Wellness" | "Sport" }))}>
                <option value="Wellness">Wellness</option>
                <option value="Sport">Sport</option>
              </select>
            </div>
            <div>
              <label>Category</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {categories?.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Format</label>
              <select value={form.format} onChange={(e) => setForm((f) => ({ ...f, format: e.target.value as typeof form.format }))}>
                <option value="capsule">Capsule</option>
                <option value="tablet">Tablet</option>
                <option value="powder">Powder</option>
                <option value="stick">Stick</option>
                <option value="gummy">Gummy</option>
              </select>
            </div>
            <div>
              <label>Serving / supply</label>
              <input value={form.servingSupply} onChange={(e) => setForm((f) => ({ ...f, servingSupply: e.target.value }))} placeholder="1 capsule · 28-day" />
            </div>
            <div className="full">
              <label>Headline</label>
              <input value={form.headline} onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))} />
            </div>
            <div className="full">
              <label>Blurb</label>
              <textarea value={form.blurb} onChange={(e) => setForm((f) => ({ ...f, blurb: e.target.value }))} />
            </div>
            <div className="full">
              <button className="admin-btn" type="submit" disabled={create.isPending}>
                {create.isPending ? "Creating…" : "Create product"}
              </button>
              {create.isError && <span style={{ color: "#8c2f22", marginLeft: 12, fontSize: 13 }}>{create.error.message}</span>}
            </div>
          </form>
        )}
      </div>

      <div className="admin-card admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Family</th>
              <th>Stock</th>
              <th>Price (1x)</th>
              <th>Price (sub)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p) => {
              const edit = edits[p.id] ?? {};
              return (
                <tr key={p.id}>
                  <td>
                    <label style={{ cursor: "pointer" }}>
                      {p.imageUrl ? (
                        <img className="admin-thumb" src={p.imageUrl} alt="" />
                      ) : (
                        <span className="admin-thumb" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "var(--muted)" }}>
                          {uploadingId === p.id ? "…" : "+"}
                        </span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(p.id, p.handle, e.target.files[0])}
                      />
                    </label>
                  </td>
                  <td className="n">{p.sku}</td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>
                    <input
                      type="text"
                      placeholder="—"
                      defaultValue={p.familyKey ?? ""}
                      style={{ width: 90 }}
                      onChange={(e) => setEdits((s) => ({ ...s, [p.id]: { ...s[p.id], familyKey: e.target.value } }))}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      defaultValue={p.stock ?? 0}
                      style={{ width: 60 }}
                      onChange={(e) => setEdits((s) => ({ ...s, [p.id]: { ...s[p.id], stock: e.target.value } }))}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="—"
                      defaultValue={p.priceOneTime ?? ""}
                      style={{ width: 60 }}
                      onChange={(e) => setEdits((s) => ({ ...s, [p.id]: { ...s[p.id], priceOneTime: e.target.value } }))}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="—"
                      defaultValue={p.priceSubscribe ?? ""}
                      style={{ width: 60 }}
                      onChange={(e) => setEdits((s) => ({ ...s, [p.id]: { ...s[p.id], priceSubscribe: e.target.value } }))}
                    />
                  </td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <button
                      className="admin-btn"
                      onClick={() =>
                        update.mutate({
                          id: p.id,
                          stock: edit.stock !== undefined ? Number(edit.stock) : undefined,
                          priceOneTime: edit.priceOneTime,
                          priceSubscribe: edit.priceSubscribe,
                          familyKey: edit.familyKey,
                        })
                      }
                    >
                      Save
                    </button>
                    <button
                      className="admin-btn danger"
                      onClick={() => {
                        if (confirm(`Delete ${p.name}? This can't be undone.`)) remove.mutate(p.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
