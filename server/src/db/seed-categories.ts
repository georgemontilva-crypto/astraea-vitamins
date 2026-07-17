// Run with: tsx server/src/db/seed-categories.ts
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./client.js";
import { categories } from "./schema.js";

const DEFAULTS: { name: string; line: "Wellness" | "Sport" | "Both" }[] = [
  { name: "Core", line: "Both" },
  { name: "On-the-Go", line: "Sport" },
  { name: "Gummy", line: "Wellness" },
];

async function main() {
  for (const c of DEFAULTS) {
    const existing = await db.query.categories.findFirst({ where: eq(categories.name, c.name) });
    if (!existing) {
      await db.insert(categories).values(c);
    }
  }
  console.log(`Seeded ${DEFAULTS.length} categories`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
