import { z } from "zod";
import { eq } from "drizzle-orm";
import { publicProcedure, adminProcedure, router } from "../trpc.js";
import { db } from "../db/client.js";
import { siteSettings } from "../db/schema.js";

export const settingsRouter = router({
  // Public: pages read named image slots to render (e.g. hero backgrounds).
  // Nothing sensitive lives here, just URLs, so no auth required.
  get: publicProcedure.input(z.string()).query(async ({ input }) => {
    const row = await db.query.siteSettings.findFirst({ where: eq(siteSettings.key, input) });
    return row?.value ?? null;
  }),

  admin: router({
    list: adminProcedure.query(async () => {
      return db.query.siteSettings.findMany();
    }),
    set: adminProcedure
      .input(z.object({ key: z.string(), value: z.string() }))
      .mutation(async ({ input }) => {
        await db
          .insert(siteSettings)
          .values(input)
          .onDuplicateKeyUpdate({ set: { value: input.value } });
        return { ok: true };
      }),
    clear: adminProcedure.input(z.string()).mutation(async ({ input }) => {
      await db.delete(siteSettings).where(eq(siteSettings.key, input));
      return { ok: true };
    }),
  }),
});
