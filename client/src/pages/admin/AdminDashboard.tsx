import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMe } from "../../lib/useMe";
import { trpc } from "../../lib/trpc";

export default function AdminDashboard() {
  const { user, isLoading, isLoggedIn } = useMe();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || user?.role !== "admin")) navigate("/admin/login");
  }, [isLoading, isLoggedIn, user, navigate]);

  if (isLoading || user?.role !== "admin") return <p style={{ padding: 48 }}>Loading…</p>;

  return (
    <section className="sec">
      <div className="wrap">
        <div className="eyebrow">Astraea Admin</div>
        <h1 style={{ fontFamily: "Marcellus,serif", fontWeight: 400, fontSize: 34, margin: "8px 0 40px" }}>
          Dashboard
        </h1>
        <ProductsTable />
        <div style={{ marginTop: 56 }}>
          <BatchesTable />
        </div>
      </div>
    </section>
  );
}

function ProductsTable() {
  const utils = trpc.useUtils();
  const { data: products, isLoading } = trpc.admin.products.listAll.useQuery();
  const update = trpc.admin.products.update.useMutation({
    onSuccess: () => utils.admin.products.listAll.invalidate(),
  });
  const [edits, setEdits] = useState<Record<number, { stock?: string; priceOneTime?: string; priceSubscribe?: string }>>({});

  if (isLoading) return <p>Loading products…</p>;

  return (
    <div>
      <h2 style={{ fontFamily: "Marcellus,serif", fontWeight: 400, fontSize: 22, marginBottom: 14 }}>
        Products ({products?.length ?? 0})
      </h2>
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Stock</th>
            <th>Price (one-time)</th>
            <th>Price (subscribe)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products?.map((p) => {
            const edit = edits[p.id] ?? {};
            return (
              <tr key={p.id}>
                <td className="n">{p.sku}</td>
                <td>{p.name}</td>
                <td>
                  <input
                    type="number"
                    defaultValue={p.stock ?? 0}
                    style={{ width: 70 }}
                    onChange={(e) => setEdits((s) => ({ ...s, [p.id]: { ...s[p.id], stock: e.target.value } }))}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="—"
                    defaultValue={p.priceOneTime ?? ""}
                    style={{ width: 70 }}
                    onChange={(e) => setEdits((s) => ({ ...s, [p.id]: { ...s[p.id], priceOneTime: e.target.value } }))}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="—"
                    defaultValue={p.priceSubscribe ?? ""}
                    style={{ width: 70 }}
                    onChange={(e) => setEdits((s) => ({ ...s, [p.id]: { ...s[p.id], priceSubscribe: e.target.value } }))}
                  />
                </td>
                <td>
                  <button
                    className="pass"
                    onClick={() =>
                      update.mutate({
                        id: p.id,
                        stock: edit.stock !== undefined ? Number(edit.stock) : undefined,
                        priceOneTime: edit.priceOneTime,
                        priceSubscribe: edit.priceSubscribe,
                      })
                    }
                  >
                    Save
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function BatchesTable() {
  const utils = trpc.useUtils();
  const { data: batches, isLoading } = trpc.admin.batches.listAll.useQuery();
  const publish = trpc.admin.batches.publish.useMutation({ onSuccess: () => utils.admin.batches.listAll.invalidate() });
  const unpublish = trpc.admin.batches.unpublish.useMutation({ onSuccess: () => utils.admin.batches.listAll.invalidate() });

  if (isLoading) return <p>Loading batches…</p>;

  return (
    <div>
      <h2 style={{ fontFamily: "Marcellus,serif", fontWeight: 400, fontSize: 22, marginBottom: 6 }}>
        Batches ({batches?.length ?? 0})
      </h2>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>
        A batch only appears on the public Lab Tests page once published. Failed batches can't be published.
      </p>
      <table>
        <thead>
          <tr>
            <th>Lot</th>
            <th>Product ID</th>
            <th>Tested</th>
            <th>Result</th>
            <th>Published</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {batches?.map((b) => (
            <tr key={b.id}>
              <td className="n">{b.lot}</td>
              <td className="n">{b.productId}</td>
              <td className="n">{b.testedAt}</td>
              <td>
                <span className="pass" style={!b.pass ? { color: "#8c2f22", borderColor: "#8c2f22" } : {}}>
                  {b.pass ? "PASS" : "FAIL"}
                </span>
              </td>
              <td>{b.published ? "✓" : "—"}</td>
              <td>
                {b.published ? (
                  <button onClick={() => unpublish.mutate(b.id)}>Unpublish</button>
                ) : (
                  <button onClick={() => publish.mutate(b.id)} disabled={!b.pass}>
                    Publish
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
