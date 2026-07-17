import { useState } from "react";
import { trpc } from "../../lib/trpc";
import { uploadFile } from "../../lib/upload";
import { IMAGE_SLOTS } from "../../lib/imageSlots";

export default function AdminImages() {
  const utils = trpc.useUtils();
  const { data: images, isLoading } = trpc.admin.siteImages.list.useQuery();
  const { data: settings, isLoading: settingsLoading } = trpc.settings.admin.list.useQuery();
  const create = trpc.admin.siteImages.create.useMutation({ onSuccess: () => utils.admin.siteImages.list.invalidate() });
  const remove = trpc.admin.siteImages.remove.useMutation({ onSuccess: () => utils.admin.siteImages.list.invalidate() });
  const setSlot = trpc.settings.admin.set.useMutation({ onSuccess: () => utils.settings.admin.list.invalidate() });
  const clearSlot = trpc.settings.admin.clear.useMutation({ onSuccess: () => utils.settings.admin.list.invalidate() });

  const [label, setLabel] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const { url, key } = await uploadFile(file, "site");
      await create.mutateAsync({ url, key, label: label || undefined });
      setLabel("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function slotFor(url: string) {
    return settings?.find((s) => s.value === url)?.key;
  }

  if (isLoading || settingsLoading) return <p>Loading…</p>;

  return (
    <div>
      <h1>Site Images ({images?.length ?? 0})</h1>

      <div className="admin-card">
        <h2>Upload</h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            type="text"
            placeholder="Label (e.g. Home hero background)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            style={{ flex: 1, padding: "9px 11px", border: "1px solid var(--hair)" }}
          />
          <input type="file" accept="image/*" disabled={uploading} onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
        </div>
        {uploading && <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>Uploading…</p>}
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
          After uploading, assign it to a section below using "Use for…" — that's what actually makes it appear on the site.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
        {images?.map((img) => {
          const assignedSlot = slotFor(img.url);
          return (
            <div key={img.id} className="admin-card" style={{ padding: 12 }}>
              <img src={img.url} alt={img.label ?? ""} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: "calc(var(--radius) - 4px)" }} />
              <p style={{ fontSize: 12, margin: "8px 0 4px" }}>{img.label || "Untitled"}</p>

              {assignedSlot ? (
                <div style={{ fontSize: 11, color: "var(--verify)", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>✓ {IMAGE_SLOTS.find((s) => s.key === assignedSlot)?.label ?? assignedSlot}</span>
                  <button
                    className="admin-btn ghost"
                    style={{ padding: "2px 8px", fontSize: 10 }}
                    onClick={() => clearSlot.mutate(assignedSlot)}
                  >
                    Unset
                  </button>
                </div>
              ) : (
                <select
                  defaultValue=""
                  style={{ width: "100%", fontSize: 11, padding: 6, border: "1px solid var(--hair)", marginBottom: 8 }}
                  onChange={(e) => {
                    if (e.target.value) setSlot.mutate({ key: e.target.value, value: img.url });
                  }}
                >
                  <option value="">Use for…</option>
                  {IMAGE_SLOTS.map((s) => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              )}

              <input
                readOnly
                value={img.url}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                style={{ width: "100%", fontSize: 10, padding: 6, border: "1px solid var(--hair)", marginBottom: 6 }}
              />
              <button className="admin-btn danger" style={{ width: "100%" }} onClick={() => remove.mutate(img.id)}>
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
