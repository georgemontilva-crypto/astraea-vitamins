// Wave-one catalog — the 12 SKUs of the 2026-08-26 rescope brief.
// Run with: tsx server/src/db/seed-wave-one.ts
//
// Deliberately incomplete, and that is the point: Supplement Facts, ingredient
// lists, claims copy, prices and final imagery are in formulation and
// regulatory review and are NOT to be invented here. Every one of those fields
// stays null until the client releases the real values in writing. The handles
// below are the contractual part — they get printed on packaging via the Lab
// Tests QR and cannot be changed once label art runs.
import "dotenv/config";
import { eq, notInArray } from "drizzle-orm";
import { db } from "./client.js";
import { products, categories } from "./schema.js";

type Seed = {
  handle: string;
  sku: string;
  name: string;
  familyKey: "daily-shake" | "sleep-gummy";
  format: "sachet" | "pouch";
  isVarietyPack?: boolean;
};

const DAILY_SHAKE_FLAVORS = ["Mango", "Mixed Berry", "Peach", "Watermelon", "Citrus"];
const SLEEP_GUMMY_FLAVORS = ["Berry", "Peach", "Cherry", "Grape", "Strawberry Lemonade"];

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const WAVE_ONE: Seed[] = [
  ...DAILY_SHAKE_FLAVORS.map((flavor, i) => ({
    handle: `daily-shake-${slug(flavor)}`,
    sku: `AST-DS-${String(i + 1).padStart(2, "0")}`,
    name: `Daily Shake — ${flavor}`,
    familyKey: "daily-shake" as const,
    format: "sachet" as const,
  })),
  {
    handle: "daily-shake-variety-pack",
    sku: "AST-DS-06",
    name: "Daily Shake — Variety Pack",
    familyKey: "daily-shake",
    format: "sachet",
    isVarietyPack: true,
  },
  ...SLEEP_GUMMY_FLAVORS.map((flavor, i) => ({
    handle: `sleep-gummy-${slug(flavor)}`,
    sku: `AST-SG-${String(i + 1).padStart(2, "0")}`,
    name: `Sleep Gummy — ${flavor}`,
    familyKey: "sleep-gummy" as const,
    format: "pouch" as const,
  })),
  {
    handle: "sleep-gummy-variety-pack",
    sku: "AST-SG-06",
    name: "Sleep Gummy — Variety Pack",
    familyKey: "sleep-gummy",
    format: "pouch",
    isVarietyPack: true,
  },
];

const SERVING_SUPPLY: Record<Seed["familyKey"], string> = {
  "daily-shake": "28 single-serve sachets · one 28-day cycle",
  "sleep-gummy": "28 two-count pouches · one 28-day cycle",
};

const CATEGORY: Record<Seed["familyKey"], string> = {
  "daily-shake": "Daily Shake",
  "sleep-gummy": "Sleep Gummy",
};

const PLACEHOLDER_BLURB =
  "Placeholder copy. Final product copy, Supplement Facts and claims are in formulation and regulatory review and will replace this before go-live.";

async function main() {
  for (const name of Object.values(CATEGORY)) {
    const existing = await db.query.categories.findFirst({ where: eq(categories.name, name) });
    if (!existing) await db.insert(categories).values({ name, line: "Both" });
  }

  for (const s of WAVE_ONE) {
    const row = {
      handle: s.handle,
      sku: s.sku,
      name: s.name,
      // The Wellness/Sport line architecture stays in the theme but is not
      // surfaced in wave one (section 3), so every SKU carries the same value
      // rather than a guessed split. Navigation is by family instead.
      line: "Wellness" as const,
      category: CATEGORY[s.familyKey],
      format: s.format,
      familyKey: s.familyKey,
      isVarietyPack: !!s.isVarietyPack,
      servingSupply: SERVING_SUPPLY[s.familyKey],
      blurb: PLACEHOLDER_BLURB,
      // Left null on purpose — see the header comment. Do not fill these in
      // from the old 37-SKU copy deck; different formulas.
      headline: null,
      whyThisForm: null,
      supplementFacts: null,
      otherIngredients: null,
      suggestedUse: null,
      priceOneTime: null,
      priceSubscribe: null,
      stock: 0,
      active: true,
    };

    const existing = await db.query.products.findFirst({ where: eq(products.handle, s.handle) });
    if (existing) {
      await db.update(products).set(row).where(eq(products.handle, s.handle));
    } else {
      await db.insert(products).values(row);
    }
  }

  // The 37-SKU catalog is on hold, not deleted — it returns in a later wave, so
  // the rows stay and are only deactivated. Nothing is dropped.
  const waveOneHandles = WAVE_ONE.map((s) => s.handle);
  const paused = await db
    .update(products)
    .set({ active: false })
    .where(notInArray(products.handle, waveOneHandles));

  console.log(`Seeded ${WAVE_ONE.length} wave-one SKUs; earlier catalog deactivated.`);
  void paused;
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
