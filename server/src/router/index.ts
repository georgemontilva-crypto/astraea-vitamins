import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";
import { db } from "../db/client.js";
import { products, batches, waitlist } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
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
      .input(z.object({ line: z.enum(["Wellness", "Sport"]).optional() }).optional())
      .query(async ({ input }) => {
        const rows = await db.query.products.findMany({
          where: input?.line ? eq(products.line, input.line) : undefined,
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
  }),

  labTests: router({
    // Powers the QR deep-link: /lab-tests?product=<handle>
    batchesForProduct: publicProcedure.input(z.string()).query(async ({ input }) => {
      const product = await db.query.products.findFirst({
        where: eq(products.handle, input),
      });
      if (!product) return null;
      const rows = await db.query.batches.findMany({
        where: eq(batches.productId, product.id),
        orderBy: desc(batches.createdAt),
      });
      // Never surface unpublished/failed lots publicly (per SOP)
      return { product, batches: rows.filter((b) => b.published) };
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
