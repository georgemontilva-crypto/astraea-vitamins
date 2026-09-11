import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";

/**
 * Pre-launch access gate.
 *
 * The 2026-08-26 brief requires password-protected staging with nothing public
 * before written go-live approval; the client confirmed on 2026-09-11 that it
 * goes up immediately.
 *
 * This is an in-page gate, not HTTP Basic auth: the visitor gets an Astraea
 * screen asking for a user and password, and none of the site renders until
 * they are in. Basic auth would have shown the browser's own grey dialog with
 * the raw hostname in it, which is the wrong first impression for a client
 * showing the build to their own regulatory reviewers.
 *
 * The gate covers EVERYTHING, API included — gating only the pages would have
 * left the data endpoints serving the full pre-launch catalog to anyone who
 * asked for it directly.
 *
 * Enabled by setting STAGING_PASSWORD. Removing that variable is what opens
 * the site at go-live: one deliberate, reversible action.
 */

const USER = process.env.STAGING_USER || "astraea";
const PASSWORD = process.env.STAGING_PASSWORD || "";

export const gateEnabled = PASSWORD.length > 0;

const COOKIE = "astraea_gate";
const GATE_PATH = "/__access";

/**
 * The cookie carries a derived value, never the password itself. Anyone reading
 * the browser's cookie jar learns nothing reusable elsewhere, and the value
 * changes automatically the moment the password is rotated, which logs everyone
 * out — the behaviour you want when you rotate it because someone left.
 */
function expectedToken() {
  return crypto.createHmac("sha256", PASSWORD).update(`gate:v1:${USER}`).digest("hex");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function authed(req: Request) {
  const token = req.cookies?.[COOKIE];
  return typeof token === "string" && safeEqual(token, expectedToken());
}

/** Only ever redirect back to a path on this site, never to an absolute URL. */
function safeNext(raw: unknown) {
  if (typeof raw !== "string") return "/";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  if (raw.startsWith(GATE_PATH)) return "/";
  return raw;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );
}

function gatePage(next: string, error?: string) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<title>Astraea</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Karla:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#F7F6F1;color:#0E1B2E;font-family:'Karla',sans-serif;line-height:1.55;
       min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;
       -webkit-font-smoothing:antialiased}
  .card{width:100%;max-width:420px}
  .brand{font-family:'Marcellus',serif;letter-spacing:.22em;font-size:22px;text-align:center;
         margin-bottom:38px}
  .eyebrow{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.24em;
           text-transform:uppercase;color:#177B54}
  .panel{background:#FDFCF9;border:1px solid #D8D5CC;padding:30px 28px}
  h1{font-family:'Marcellus',serif;font-weight:400;font-size:26px;margin:10px 0 6px}
  p.lede{color:#5a6478;font-size:14.5px;margin-bottom:22px}
  label{display:block;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.1em;
        text-transform:uppercase;color:#5a6478;margin-bottom:5px}
  input{width:100%;padding:11px 12px;border:1px solid #D8D5CC;background:#fff;
        font-family:'Karla',sans-serif;font-size:15px;color:#0E1B2E;margin-bottom:16px}
  input:focus{outline:none;border-color:#0E1B2E}
  button{width:100%;background:#0E1B2E;color:#F7F6F1;border:1px solid #0E1B2E;padding:12px 16px;
         font-family:'Karla',sans-serif;font-size:14.5px;letter-spacing:.02em;cursor:pointer}
  button:hover{background:#122239}
  .err{background:#fdf1ef;border:1px solid #e0c3bd;color:#8c2f22;font-size:13.5px;
       padding:10px 12px;margin-bottom:18px}
  .foot{text-align:center;color:#5a6478;font-size:12.5px;margin-top:22px}
</style>
</head>
<body>
  <div class="card">
    <div class="brand">ASTRAEA</div>
    <div class="panel">
      <div class="eyebrow">Pre-launch</div>
      <h1>This site isn't public yet.</h1>
      <p class="lede">Enter the access details you were given to continue.</p>
      ${error ? `<div class="err">${escapeHtml(error)}</div>` : ""}
      <form method="POST" action="${GATE_PATH}">
        <input type="hidden" name="next" value="${escapeHtml(next)}">
        <label for="u">User</label>
        <input id="u" name="user" autocomplete="username" autocapitalize="none"
               autocorrect="off" spellcheck="false" required autofocus>
        <label for="p">Password</label>
        <input id="p" name="password" type="password" autocomplete="current-password" required>
        <button type="submit">Enter</button>
      </form>
    </div>
    <div class="foot">Astraea Vitamin Inc</div>
  </div>
</body>
</html>`;
}

/** Attempt throttling, per IP. Not a fortress; enough that the form isn't brute-forceable. */
const attempts = new Map<string, { n: number; until: number }>();
const MAX_ATTEMPTS = 8;
const LOCKOUT_MS = 5 * 60 * 1000;

function lockedOut(ip: string) {
  const rec = attempts.get(ip);
  if (!rec) return false;
  if (Date.now() > rec.until) {
    attempts.delete(ip);
    return false;
  }
  return rec.n >= MAX_ATTEMPTS;
}

function recordFailure(ip: string) {
  const rec = attempts.get(ip);
  const n = rec && Date.now() <= rec.until ? rec.n + 1 : 1;
  attempts.set(ip, { n, until: Date.now() + LOCKOUT_MS });
}

/** Mounted before every other route. */
export function stagingGate(req: Request, res: Response, next: NextFunction) {
  if (!gateEnabled) return next();

  // Railway's healthcheck cannot log in; without this the deploy never goes green.
  if (req.path === "/healthz") return next();

  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");

  if (req.path === GATE_PATH) {
    if (req.method === "POST") {
      const ip = req.ip || "unknown";
      const target = safeNext((req.body as any)?.next);

      if (lockedOut(ip)) {
        return res
          .status(429)
          .type("html")
          .send(gatePage(target, "Too many attempts. Try again in a few minutes."));
      }

      const { user, password } = (req.body ?? {}) as { user?: string; password?: string };
      if (typeof user === "string" && typeof password === "string" &&
          safeEqual(user, USER) && safeEqual(password, PASSWORD)) {
        res.cookie(COOKIE, expectedToken(), {
          httpOnly: true,
          sameSite: "lax",
          secure: req.protocol === "https" || req.get("x-forwarded-proto") === "https",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return res.redirect(302, target);
      }

      recordFailure(ip);
      // One message for both wrong user and wrong password, so the form can't
      // be used to discover which half was right.
      return res
        .status(401)
        .type("html")
        .send(gatePage(target, "Those details weren't recognised."));
    }

    if (authed(req)) return res.redirect(302, "/");
    return res.type("html").send(gatePage(safeNext(req.query.next)));
  }

  if (authed(req)) return next();

  // API callers get JSON, not a login page they cannot render.
  if (req.path.startsWith("/api/")) {
    return res.status(401).json({ error: "This site is not public yet." });
  }

  const target = safeNext(req.originalUrl);
  return res.status(401).type("html").send(gatePage(target));
}

export function robotsTxt(_req: Request, res: Response) {
  res.type("text/plain");
  res.send(gateEnabled ? "User-agent: *\nDisallow: /\n" : "User-agent: *\nAllow: /\n");
}
