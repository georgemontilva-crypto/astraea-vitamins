import { useState } from "react";
import { trpc } from "../../lib/trpc";

export default function AdminCategories() {
  const utils = trpc.useUtils();
  const { data: categories, isLoading } = trpc.admin.categories.list.useQuery();
  const create = trpc.admin.categories.create.useMutation({ onSuccess: () => utils.admin.categories.list.invalidate() });
  const remove = trpc.admin.categories.remove.useMutation({ onSuccess: () => utils.admin.categories.list.invalidate() });

  const [name, setName] = useState("");
  const [line, setLine] = useState<"Wellness" | "Sport" | "Both">("Both");

  if (isLoading) return <p>Loading…</p>;

  return (
    <div>
      <h1>Categories ({categories?.length ?? 0})</h1>

      <div className="admin-card">
        <h2>Add category</h2>
        <form
          className="admin-form"
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate({ name, line });
            setName("");
          }}
        >
          <div>
            <label>Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Travel Kit" />
          </div>
          <div>
            <label>Line</label>
            <select value={line} onChange={(e) => setLine(e.target.value as typeof line)}>
              <option value="Both">Both</option>
              <option value="Wellness">Wellness</option>
              <option value="Sport">Sport</option>
            </select>
          </div>
          <div className="full">
            <button className="admin-btn" type="submit">Add category</button>
          </div>
        </form>
      </div>

      <div className="admin-card admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Line</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.line}</td>
                <td>
                  <button
                    className="admin-btn danger"
                    onClick={() => {
                      if (confirm(`Delete category "${c.name}"? Products keep their current value but won't be able to pick it again.`))
                        remove.mutate(c.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
