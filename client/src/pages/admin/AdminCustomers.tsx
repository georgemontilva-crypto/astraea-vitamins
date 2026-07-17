import { trpc } from "../../lib/trpc";

export default function AdminCustomers() {
  const { data: customers, isLoading } = trpc.admin.customers.list.useQuery();

  if (isLoading) return <p>Loading…</p>;

  return (
    <div>
      <h1>Customers ({customers?.length ?? 0})</h1>
      <div className="admin-card admin-table-wrap">
        {customers?.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 14 }}>No customer accounts yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers?.map((c) => (
                <tr key={c.id}>
                  <td>{c.name ?? "—"}</td>
                  <td>{c.email}</td>
                  <td className="n">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
