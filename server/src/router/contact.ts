import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";
import { db } from "../db/client.js";
import { contactMessages } from "../db/schema.js";
import { sendContactNotification } from "../lib/email.js";

export const contactRouter = router({
  send: publicProcedure
    .input(z.object({ name: z.string().min(1), email: z.string().email(), message: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const emailSent = await sendContactNotification(input);
      await db.insert(contactMessages).values({ ...input, emailSent });
      return { ok: true };
    }),
});
