import type { Request, Response, NextFunction } from "express";

/**
 * Permanent (301) redirects.
 *
 * Every redirect here is a 301, not a 302 — carry-over fix from the client's
 * 2026-08-26 review round, which flagged that 302s had been delivered where
 * 301s were specified. A 302 tells search engines and QR scanners the old URL
 * is still the real one, which is exactly wrong for a URL printed on a carton.
 */

/**
 * The canonical Lab Tests URL is /lab/<handle> — that is what gets printed.
 * These older shapes still resolve so nothing already in circulation breaks.
 */
function labTestsAliases(req: Request): string | null {
  // /lab-tests/<handle> -> /lab/<handle>
  const pathMatch = req.path.match(/^\/lab-tests\/([a-z0-9-]+)\/?$/i);
  if (pathMatch) return `/lab/${pathMatch[1].toLowerCase()}`;

  // /lab-tests?product=<handle> -> /lab/<handle>  (the pre-rescope QR target)
  if (/^\/lab-tests\/?$/i.test(req.path)) {
    const product = req.query.product;
    if (typeof product === "string" && /^[a-z0-9-]+$/i.test(product)) {
      return `/lab/${product.toLowerCase()}`;
    }
  }
  return null;
}

/**
 * The 37-SKU catalog is on hold, not renamed — it returns in a later wave, so
 * there is no honest one-to-one mapping from an old handle to a wave-one SKU.
 * Pointing /products/ashwagandha-ksm-66 at a Daily Shake flavor would be a
 * false equivalence, so paused products land on the shop index instead.
 *
 * NOTE: the client's section 6 asks us to "deliver 301s where 301s were
 * specified" — that original redirect list is not in either brief. This map is
 * the mechanism; the specified pairs still need to be supplied and added here.
 */
export const PAUSED_PRODUCT_REDIRECT = "/shop";

const PAUSED_PRODUCT_HANDLES: string[] = [];

export function legacyRedirects(req: Request, res: Response, next: NextFunction) {
  if (req.method !== "GET" && req.method !== "HEAD") return next();

  const labTarget = labTestsAliases(req);
  if (labTarget) return res.redirect(301, labTarget);

  const productMatch = req.path.match(/^\/products\/([a-z0-9-]+)\/?$/i);
  if (productMatch && PAUSED_PRODUCT_HANDLES.includes(productMatch[1].toLowerCase())) {
    return res.redirect(301, PAUSED_PRODUCT_REDIRECT);
  }

  next();
}
