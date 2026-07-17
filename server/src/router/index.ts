import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { db } from "../db/client.js";
import { products, batches, waitlist } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";

const t = initTRPC.create();

export const appRouter = t.router({
  products: t.router({
    list: t.procedure
      .input(z.object({ line: z.enum(["Wellness", "Sport"]).optional() }).optional())
      .query(async ({ input }) => {
        const rows = await db.query.products.findMany({
          where: input?.line ? eq(products.line, input.line) : undefined,
        });
        return rows;
      }),
    byHandle: t.procedure.input(z.string()).query(async ({ input }) => {
      return db.query.products.findFirst({ where: eq(products.handle, input) });
    }),
  }),

  labTests: t.router({
    // Powers the QR deep-link: /lab-tests?product=<handle>
    batchesForProduct: t.procedure.input(z.string()).query(async ({ input }) => {
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
  }),

  waitlist: t.router({
    join: t.procedure.input(z.object({ email: z.string().email() })).mutation(async ({ input }) => {
      await db.insert(waitlist).values({ email: input.email }).onDuplicateKeyUpdate({
        set: { email: input.email },
      });
      return { ok: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
