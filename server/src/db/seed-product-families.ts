// Links the 5 known jar <-> On-the-Go stick sibling pairs via familyKey, so
// the PDP format switcher has real data to show. Run after seed.ts.
// Run with: tsx server/src/db/seed-product-families.ts
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./client.js";
import { products } from "./schema.js";

const FAMILIES: { familyKey: string; handles: string[] }[] = [
  { familyKey: "creatine", handles: ["creatine-monohydrate", "creatine-on-the-go"] },
  { familyKey: "electrolytes", handles: ["electrolyte-powder", "electrolytes-on-the-go"] },
  { familyKey: "greens", handles: ["greens-blend", "greens-on-the-go"] },
  { familyKey: "pre-workout", handles: ["pre-workout", "pre-workout-on-the-go"] },
  { familyKey: "eaas", handles: ["eaas-bcaas", "eaas-on-the-go"] },
];

async function main() {
  let updated = 0;
  for (const family of FAMILIES) {
    for (const handle of family.handles) {
      const result = await db.update(products).set({ familyKey: family.familyKey }).where(eq(products.handle, handle));
      updated++;
    }
  }
  console.log(`Set familyKey on ${updated} products across ${FAMILIES.length} families`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
