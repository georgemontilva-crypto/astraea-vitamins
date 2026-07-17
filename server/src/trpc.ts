import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { AUTH_COOKIE, verifyToken, type JwtPayload } from "./lib/auth.js";

export function createContext({ req, res }: CreateExpressContextOptions) {
  const token = req.cookies?.[AUTH_COOKIE] as string | undefined;
  const user: JwtPayload | null = token ? verifyToken(token) : null;
  return { req, res, user };
}

type Context = ReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

/** Requires a logged-in user (customer or admin). */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Log in to continue." });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

/** Requires role: "admin". */
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required." });
  }
  return next({ ctx });
});
