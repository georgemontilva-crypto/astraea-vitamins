import type { Request, Response, NextFunction } from "express";

/**
 * Password gate for the pre-launch site.
 *
 * The 2026-08-26 brief requires password-protected staging and no public
 * exposure before written go-live approval, and the client confirmed on
 * 2026-09-11 that it goes up immediately. The gate sits in front of
 * EVERYTHING, API included — gating only the HTML would leave the tRPC
 * endpoints serving the full catalog to anyone who asked.
 *
 * /healthz is the single exception, because Railway's healthcheck cannot
 * authenticate and the deploy would never go green.
 *
 * Enabled by setting STAGING_PASSWORD. Removing that variable is what opens
 * the site at go-live — a deliberate, single, reversible action.
 */

const USER = process.env.STAGING_USER || "astraea";
const PASSWORD = process.env.STAGING_PASSWORD || "";

export const gateEnabled = PASSWORD.length > 0;

function unauthorized(res: Response) {
  // ASCII only: a non-ASCII character here (an em dash, say) makes Node throw
  // ERR_INVALID_CHAR and every gated request 500s instead of prompting.
  res.setHeader("WWW-Authenticate", 'Basic realm="Astraea pre-launch", charset="UTF-8"');
  return res.status(401).send("Authentication required.");
}

/** Constant-time-ish compare so the password isn't guessable byte by byte. */
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function stagingGate(req: Request, res: Response, next: NextFunction) {
  if (!gateEnabled) return next();
  if (req.path === "/healthz") return next();

  // While gated, nothing should be indexable — belt and braces alongside
  // robots.txt, since a 401 page can still be linked to.
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");

  const header = req.headers.authorization;
  if (!header?.startsWith("Basic ")) return unauthorized(res);

  const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  const sep = decoded.indexOf(":");
  if (sep === -1) return unauthorized(res);

  const user = decoded.slice(0, sep);
  const pass = decoded.slice(sep + 1);
  if (safeEqual(user, USER) && safeEqual(pass, PASSWORD)) return next();

  return unauthorized(res);
}

/** Disallow everything while the site is gated; normal file once it is not. */
export function robotsTxt(_req: Request, res: Response) {
  res.type("text/plain");
  res.send(gateEnabled ? "User-agent: *\nDisallow: /\n" : "User-agent: *\nAllow: /\n");
}
