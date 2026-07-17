import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "../trpc.js";
import { db } from "../db/client.js";
import { users } from "../db/schema.js";
import { hashPassword, comparePassword, signToken, AUTH_COOKIE, authCookieOptions } from "../lib/auth.js";

export const authRouter = router({
  register: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(8), name: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const existing = await db.query.users.findFirst({ where: eq(users.email, input.email) });
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Email already registered." });
      }
      const passwordHash = await hashPassword(input.password);
      const [result] = await db.insert(users).values({
        email: input.email,
        passwordHash,
        name: input.name,
        role: "customer",
      });
      const token = signToken({ userId: result.insertId, email: input.email, role: "customer" });
      ctx.res.cookie(AUTH_COOKIE, token, authCookieOptions);
      return { id: result.insertId, email: input.email, name: input.name, role: "customer" as const };
    }),

  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = await db.query.users.findFirst({ where: eq(users.email, input.email) });
      if (!user || !(await comparePassword(input.password, user.passwordHash))) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
      }
      const token = signToken({ userId: user.id, email: user.email, role: user.role });
      ctx.res.cookie(AUTH_COOKIE, token, authCookieOptions);
      return { id: user.id, email: user.email, name: user.name, role: user.role };
    }),

  logout: publicProcedure.mutation(({ ctx }) => {
    ctx.res.clearCookie(AUTH_COOKIE, { path: "/" });
    return { ok: true };
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.query.users.findFirst({ where: eq(users.id, ctx.user.userId) });
    if (!user) throw new TRPCError({ code: "NOT_FOUND" });
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }),
});
