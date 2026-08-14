// DEMO DATA ONLY -- do not run this against production / a client-facing
// environment. This seeds the SAME prototype sample data the client
// explicitly flagged as showing up on the live site looking like real lab
// results (fake Ashwagandha lot 26-0114, etc.). It now inserts as
// published: false, and is intentionally NOT part of `npm run db:seed` --
// run it manually only to demo the Lab Tests UI locally / in a staging DB
// that customers never see. Real batches belong in the admin panel
// (/admin/lab-reports), created from actual COAs and explicitly published
// once a lab confirms PASS.
//
// Run with: tsx server/src/db/seed-batches.ts (after seed.ts)
import "dotenv/config";
import { db } from "./client.js";
import { products, batches } from "./schema.js";
import { eq } from "drizzle-orm";

const SAMPLE: Record<string, { lot: string; tested: string; pass: boolean; panels: any[] }[]> = {
  "ashwagandha-ksm-66": [
    {
      lot: "26-0114",
      tested: "03 FEB 2026",
      pass: true,
      panels: [
        { panel: "Identity (HPTLC)", claimLimit: "Confirmed", tested: "W. somnifera ✓", status: "PASS" },
        { panel: "Withanolides (HPLC)", claimLimit: "≥ 5.0%", tested: "5.14%", status: "PASS" },
        { panel: "Lead", claimLimit: "< 0.5 µg", tested: "0.06 µg", status: "PASS" },
        { panel: "As / Cd / Hg", claimLimit: "USP", tested: "Below limit", status: "PASS" },
        { panel: "Microbials", claimLimit: "USP", tested: "None", status: "PASS" },
      ],
    },
  ],
  "creatine-monohydrate": [
    {
      lot: "26-0128",
      tested: "07 FEB 2026",
      pass: true,
      panels: [
        { panel: "Identity", claimLimit: "Confirmed", tested: "Match ✓", status: "PASS" },
        { panel: "Assay", claimLimit: "≥ 99.5%", tested: "99.9%", status: "PASS" },
        { panel: "DCD / DHT", claimLimit: "Below limit", tested: "Not detected", status: "PASS" },
        { panel: "Heavy metals", claimLimit: "USP", tested: "Below limit", status: "PASS" },
      ],
    },
    {
      lot: "25-1140",
      tested: "13 DEC 2025",
      pass: true,
      panels: [
        { panel: "Identity", claimLimit: "Confirmed", tested: "Match ✓", status: "PASS" },
        { panel: "Assay", claimLimit: "≥ 99.5%", tested: "99.8%", status: "PASS" },
        { panel: "DCD / DHT", claimLimit: "Below limit", tested: "Not detected", status: "PASS" },
        { panel: "Heavy metals", claimLimit: "USP", tested: "Below limit", status: "PASS" },
      ],
    },
  ],
  "daily-foundation-multi-v2": [
    {
      lot: "26-0102",
      tested: "21 JAN 2026",
      pass: true,
      panels: [
        { panel: "Identity", claimLimit: "Confirmed", tested: "Match ✓", status: "PASS" },
        { panel: "Vitamin assay", claimLimit: "Label ±10%", tested: "Within", status: "PASS" },
        { panel: "Heavy metals", claimLimit: "USP", tested: "Below limit", status: "PASS" },
        { panel: "Microbials", claimLimit: "USP", tested: "None", status: "PASS" },
      ],
    },
  ],
};

async function main() {
  for (const [handle, lots] of Object.entries(SAMPLE)) {
    const product = await db.query.products.findFirst({ where: eq(products.handle, handle) });
    if (!product) {
      console.warn(`Skipping ${handle} — not found (check seed.ts ran first / slug matches)`);
      continue;
    }
    for (const lot of lots) {
      await db.insert(batches).values({
        productId: product.id,
        lot: lot.lot,
        testedAt: lot.tested,
        pass: lot.pass,
        labName: "[ACCREDITED LAB NAME]",
        panels: lot.panels,
        published: false,
      });
    }
  }
  console.log("Seeded sample batches");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
