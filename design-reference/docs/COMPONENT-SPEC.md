# Astraea — Component Inventory & Design Spec

Reference for rebuilding the storefront in Shopify. Every component below appears in
`prototype/storefront.html` (the clickable prototype) and/or the page mockups. Build to these;
the prototype is the canonical behavior + styling reference.

## Design tokens (authoritative)

```css
--ink:#0E1B2E;        /* primary type, dark sections, closures */
--ink2:#122239;       /* raised dark panels */
--paper:#F7F6F1;      /* page background / label ground */
--paper2:#FDFCF9;     /* card / raised light ground */
--star:#A9C0D8;       /* Wellness accent */
--starDark:#41628a;   /* Wellness text/detail on light */
--verify:#177B54;     /* testing / COA ONLY — never decorative */
--verifyBright:#5FD6A7;/* PASS on dark */
--ember:#C08A3E;      /* Sport accent */
--hair:#D8D5CC;       /* borders, rules */
--muted:#5a6478;      /* secondary text */
```

Fonts (Google): **Marcellus** (display), **Karla** 300/400/600 (body), **IBM Plex Mono** 400/500 (data/eyebrows).
Zero border-radius on structural elements; radius only on soft product/bottle art. Generous whitespace.

## Components

| Component | Where | Notes for build |
|---|---|---|
| **Sticky nav** | all pages | Blur-backdrop paper bar, Marcellus wordmark left, text links, mono cart pill. Active link = verify-green underline. |
| **Hero (dark)** | home | Ink background + animated constellation SVG, mono eyebrow, large Marcellus headline, 300-weight sub, two CTAs (solid + ghost), mono "proof strip" with pulsing verify dot. |
| **Eyebrow** | everywhere | Mono, 11px, .24em tracking, uppercase, verify-green. Section labels — encode section role, not decoration. |
| **Product card** | shop, home | Paper2 thumb w/ bottle SVG, line-color top rule, mono line label, Marcellus name, mono dose + price, mono "TESTED" chip. Hover: lift + ink border. |
| **Filter pills** | shop | Mono, toggle; active = ink fill. Filters by line and format. |
| **Bottle / jar SVG** | cards, PDP | Programmatic per line color + format (bottle vs powder jar). Placeholder until photography lands — swap for real shots. |
| **Buy box** | PDP | Two radio options: Subscribe (28-day, save 15%) vs one-time. Selected = ink border + verify dot. Ink "Add to cart"; ghost verify "Check this product's testing →" → Lab Tests. |
| **Supplement Facts panel** | PDP | STRICT black-on-white Arial in a ruled box — deliberately un-branded. Do not restyle; it must read as a document. |
| **Free-from tags** | PDP | Mono chips, hairline border, muted. |
| **"Why this form" block** | PDP | Verify-green mono heading + short prose. Education, not hype. |
| **Reviews** | PDP | Verified-buyer chip (verify green). Ember stars. Honest only — never fabricate. |
| **How-it-works steps** | home | 3 numbered steps in a bordered row (numbers are real sequence). QR visual on step 1. |
| **Line split blocks** | home | Two dark gradient panels (starlight / ember) linking to collections. |
| **"Why we test" band** | home | Ink band, verify accents, a mini COA readout. Turns the fixed-QR decision into the trust message. |
| **Lab Tests selector** | lab tests | Product dropdown (grouped by line) + batch dropdown (newest first). Reads `?product=` to pre-filter from the per-product QR. |
| **COA result** | lab tests | Verify-green pass banner, mono meta grid, label-vs-tested table, COA PDF download. Fail state = deep-red banner. |
| **Footer** | all | Ink, mono column heads (star), links, FDA disclaimer in the base row. |

## Behavior notes
- **Per-product QR:** each product's fixed QR encodes only `?product=<handle>` — never a batch. The Lab Tests page pre-selects the product and shows the latest batch; the shopper picks their lot. See Build Brief → Batch-COA System.
- **Batch data:** model each lot as a `batch` metaobject; the prototype's `LAB`/`DATA` objects show the shape to replicate against live data.
- **No browser storage** in production the way a demo might fake it — drive from Shopify.
- **Quality floor:** responsive to mobile, visible keyboard focus, `prefers-reduced-motion` respected (prototype already does this).

## Where things live
- `prototype/storefront.html` — clickable Home / Shop / PDP / Lab Tests (canonical reference)
- `pages/` — individual page + packaging mockups
- `index.html` — token & file reference
- Build Brief (separate xlsx) — scope, sitemap, batch architecture, publishing SOP
- Brand & Messaging Guide (separate) — voice, claims guardrails, copy
