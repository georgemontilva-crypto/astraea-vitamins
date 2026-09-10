import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";
import { db } from "../db/client.js";
import { products, batches, waitlist } from "../db/schema.js";
import { eq, desc, and, inArray } from "drizzle-orm";
import { authRouter } from "./auth.js";
import { adminRouter } from "./admin.js";
import { contactRouter } from "./contact.js";
import { settingsRouter } from "./settings.js";

export const appRouter = router({
  auth: authRouter,
  admin: adminRouter,
  contact: contactRouter,
  settings: settingsRouter,

  products: router({
    list: publicProcedure
      .input(
        z
          .object({
            line: z.enum(["Wellness", "Sport"]).optional(),
            // Wave-one navigation is by formula family, not by line.
            family: z.string().optional(),
            varietyOnly: z.boolean().optional(),
          })
          .optional()
      )
      .query(async ({ input }) => {
        const filters = [
          input?.line ? eq(products.line, input.line) : undefined,
          input?.family ? eq(products.familyKey, input.family) : undefined,
          input?.varietyOnly ? eq(products.isVarietyPack, true) : undefined,
        ].filter(Boolean);
        const rows = await db.query.products.findMany({
          where: filters.length ? and(...(filters as any[])) : undefined,
        });
        // The TESTED badge must reflect a real published batch, not just exist
        // unconditionally — otherwise it's a false testing claim on every SKU
        // that hasn't actually shipped a tested lot yet.
        const publishedBatches = await db.query.batches.findMany({ where: eq(batches.published, true) });
        const testedProductIds = new Set(publishedBatches.map((b) => b.productId));
        return rows.map((p) => ({ ...p, tested: testedProductIds.has(p.id) }));
      }),
    byHandle: publicProcedure.input(z.string()).query(async ({ input }) => {
      return db.query.products.findFirst({ where: eq(products.handle, input) });
    }),
    // Powers the PDP format switcher (jar <-> stick box) — other products
    // sharing the same familyKey are the same underlying product in a
    // different format.
    siblingsOf: publicProcedure.input(z.string()).query(async ({ input }) => {
      const product = await db.query.products.findFirst({ where: eq(products.handle, input) });
      if (!product?.familyKey) return [];
      const rows = await db.query.products.findMany({
        where: eq(products.familyKey, product.familyKey),
      });
      return rows.filter((p) => p.id !== product.id);
    }),
  }),

  labTests: router({
    // Powers the printed QR: /lab/<handle> (and the legacy ?product=<handle>).
    //
    // Returns the lots grouped by the flavor they belong to. A normal SKU gets
    // exactly one group (itself). A variety pack gets one group per flavor in
    // the carton, because a single flat dropdown mixing five flavors' lots
    // would ask the customer to guess which lot is the sachet in their hand.
    batchesForProduct: publicProcedure.input(z.string()).query(async ({ input }) => {
      const product = await db.query.products.findFirst({
        where: eq(products.handle, input),
      });
      if (!product) return null;

      const members =
        product.isVarietyPack && product.familyKey
          ? await db.query.products.findMany({
              where: and(
                eq(products.familyKey, product.familyKey),
                eq(products.isVarietyPack, false)
              ),
            })
          : [product];

      const memberIds = members.map((m) => m.id);
      const rows = memberIds.length
        ? await db.query.batches.findMany({
            where: inArray(batches.productId, memberIds),
            orderBy: desc(batches.createdAt),
          })
        : [];

      // Never surface unpublished/failed lots publicly (per SOP-02).
      const published = rows.filter((b) => b.published);

      const groups = members
        .map((m) => ({
          handle: m.handle,
          name: m.name,
          batches: published.filter((b) => b.productId === m.id),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      return {
        product,
        isVarietyPack: !!product.isVarietyPack,
        groups,
        // Kept flat for the single-flavor case so existing callers don't break.
        batches: product.isVarietyPack ? [] : published,
      };
    }),

    // Powers the "why we test" example on Home — a real published batch if one
    // exists yet, otherwise the page falls back to an honest "coming at launch"
    // message instead of showing prototype sample data as if it were real.
    featured: publicProcedure.query(async () => {
      const batch = await db.query.batches.findFirst({
        where: eq(batches.published, true),
        orderBy: desc(batches.createdAt),
      });
      if (!batch) return null;
      const product = await db.query.products.findFirst({ where: eq(products.id, batch.productId) });
      if (!product) return null;
      const panels = (batch.panels as { status: string }[] | null) ?? [];
      return {
        productName: product.name,
        lot: batch.lot,
        panelCount: panels.length,
        allPass: panels.length > 0 && panels.every((p) => p.status === "PASS"),
      };
    }),
  }),

  waitlist: router({
    join: publicProcedure.input(z.object({ email: z.string().email() })).mutation(async ({ input }) => {
      await db.insert(waitlist).values({ email: input.email }).onDuplicateKeyUpdate({
        set: { email: input.email },
      });
      return { ok: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
