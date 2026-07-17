import { z } from "zod";
import { eq } from "drizzle-orm";
import { adminProcedure, router } from "../trpc.js";
import { db } from "../db/client.js";
import { products, batches, categories, users, siteImages } from "../db/schema.js";

export const adminRouter = router({
  products: router({
    listAll: adminProcedure.query(async () => {
      return db.query.products.findMany({ orderBy: (p, { asc }) => asc(p.sku) });
    }),
    create: adminProcedure
      .input(
        z.object({
          handle: z.string().min(1),
          sku: z.string().min(1),
          name: z.string().min(1),
          line: z.enum(["Wellness", "Sport"]),
          category: z.string().min(1),
          format: z.enum(["capsule", "tablet", "powder", "stick", "gummy"]),
          servingSupply: z.string().optional(),
          headline: z.string().optional(),
          blurb: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.insert(products).values({ ...input, stock: 0 });
        return { ok: true };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          line: z.enum(["Wellness", "Sport"]).optional(),
          category: z.string().optional(),
          headline: z.string().optional(),
          blurb: z.string().optional(),
          whyThisForm: z.string().optional(),
          freeFromTags: z.string().optional(),
          otherIngredients: z.string().optional(),
          suggestedUse: z.string().optional(),
          stock: z.number().optional(),
          priceOneTime: z.string().optional(),
          priceSubscribe: z.string().optional(),
          imageUrl: z.string().optional(),
          labelPdfUrl: z.string().optional(),
          active: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...rest } = input;
        await db.update(products).set(rest).where(eq(products.id, id));
        return { ok: true };
      }),
    remove: adminProcedure.input(z.number()).mutation(async ({ input }) => {
      await db.delete(products).where(eq(products.id, input));
      return { ok: true };
    }),
  }),

  categories: router({
    list: adminProcedure.query(async () => {
      return db.query.categories.findMany({ orderBy: (c, { asc }) => asc(c.name) });
    }),
    create: adminProcedure
      .input(z.object({ name: z.string().min(1), line: z.enum(["Wellness", "Sport", "Both"]) }))
      .mutation(async ({ input }) => {
        await db.insert(categories).values(input);
        return { ok: true };
      }),
    remove: adminProcedure.input(z.number()).mutation(async ({ input }) => {
      await db.delete(categories).where(eq(categories.id, input));
      return { ok: true };
    }),
  }),

  customers: router({
    list: adminProcedure.query(async () => {
      const rows = await db.query.users.findMany({
        where: eq(users.role, "customer"),
        orderBy: (u, { desc }) => desc(u.createdAt),
      });
      // never send password hashes to the client
      return rows.map(({ passwordHash, ...safe }) => safe);
    }),
  }),

  siteImages: router({
    list: adminProcedure.query(async () => {
      return db.query.siteImages.findMany({ orderBy: (i, { desc }) => desc(i.createdAt) });
    }),
    create: adminProcedure
      .input(z.object({ key: z.string(), url: z.string(), label: z.string().optional() }))
      .mutation(async ({ input }) => {
        await db.insert(siteImages).values(input);
        return { ok: true };
      }),
    remove: adminProcedure.input(z.number()).mutation(async ({ input }) => {
      await db.delete(siteImages).where(eq(siteImages.id, input));
      return { ok: true };
    }),
  }),

  batches: router({
    listAll: adminProcedure.query(async () => {
      return db.query.batches.findMany({ orderBy: (b, { desc }) => desc(b.createdAt) });
    }),
    // Admin view includes unpublished/failed lots — the public labTests router filters those out.
    listForProduct: adminProcedure.input(z.number()).query(async ({ input }) => {
      return db.query.batches.findMany({ where: eq(batches.productId, input) });
    }),
    create: adminProcedure
      .input(
        z.object({
          productId: z.number(),
          lot: z.string(),
          manufacturedAt: z.string().optional(),
          testedAt: z.string().optional(),
          bestBy: z.string().optional(),
          pass: z.boolean(),
          labName: z.string().optional(),
          reportNumber: z.string().optional(),
          coaPdfUrl: z.string().optional(),
          supplierCoaUrl: z.string().optional(),
          panels: z.array(z.object({ panel: z.string(), claimLimit: z.string(), tested: z.string(), status: z.string() })),
        })
      )
      .mutation(async ({ input }) => {
        // Per the Build Brief's Batch Publishing SOP: a lot is never published on
        // creation — `published` flips true only via the explicit publish step below.
        await db.insert(batches).values({ ...input, published: false });
        return { ok: true };
      }),
    // Explicit publish step (SOP-05): only PASS batches should be published;
    // a failed batch stays visible to admins only, never to the storefront.
    publish: adminProcedure.input(z.number()).mutation(async ({ input }) => {
      const batch = await db.query.batches.findFirst({ where: eq(batches.id, input) });
      if (!batch) throw new Error("Batch not found");
      if (!batch.pass) throw new Error("Cannot publish a failed batch — it must not ship.");
      await db.update(batches).set({ published: true }).where(eq(batches.id, input));
      return { ok: true };
    }),
    unpublish: adminProcedure.input(z.number()).mutation(async ({ input }) => {
      await db.update(batches).set({ published: false }).where(eq(batches.id, input));
      return { ok: true };
    }),
  }),
});
