import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";
import { db } from "../db/client.js";
import { products, batches, waitlist } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { authRouter } from "./auth.js";
import { adminRouter } from "./admin.js";
import { contactRouter } from "./contact.js";

export const appRouter = router({
  auth: authRouter,
  admin: adminRouter,
  contact: contactRouter,

  products: router({
    list: publicProcedure
      .input(z.object({ line: z.enum(["Wellness", "Sport"]).optional() }).optional())
      .query(async ({ input }) => {
        return db.query.products.findMany({
          where: input?.line ? eq(products.line, input.line) : undefined,
        });
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
