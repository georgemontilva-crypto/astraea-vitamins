// Seeds the 37 SKUs from the client's PDP Copy Deck (data/pdp-copy.json).
// Run with: tsx server/src/db/seed.ts
// NOTE: prices, stock, and images are placeholders — none were provided by
// the client and must be filled in before launch (see README "Pending from client").
import "dotenv/config";
import fs from "fs";
import { db } from "./client.js";
import { products } from "./schema.js";

type PdpRow = {
  "#": number;
  SKU: string;
  Cat: "Core" | "On-the-Go" | "Gummy";
  Line: "Wellness" | "Sport";
  "Serving / supply": string;
  "Headline (PDP H1 sub)": string;
  "Blurb (2–3 sentences)": string;
  "Why this form": string;
  "Free-from tags": string;
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatFor(cat: string, servingSupply: string) {
  if (cat === "Gummy") return "gummy" as const;
  if (cat === "On-the-Go") return "stick" as const;
  if (/scoop/i.test(servingSupply)) return "powder" as const;
  if (/tablet/i.test(servingSupply)) return "tablet" as const;
  return "capsule" as const;
}

async function main() {
  const rows: PdpRow[] = JSON.parse(fs.readFileSync("data/pdp-copy.json", "utf-8"));

  for (const r of rows) {
    await db.insert(products).values({
      handle: slugify(r.SKU),
      sku: `AST-${String(r["#"]).padStart(2, "0")}`,
      name: r.SKU,
      line: r.Line,
      category: r.Cat,
      format: formatFor(r.Cat, r["Serving / supply"]),
      servingSupply: r["Serving / supply"],
      headline: r["Headline (PDP H1 sub)"],
      blurb: r["Blurb (2–3 sentences)"],
      whyThisForm: r["Why this form"],
      freeFromTags: r["Free-from tags"],
      stock: 0, // pending: client hasn't provided inventory numbers
    });
  }
  console.log(`Seeded ${rows.length} products`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
