# Reaching Dreams — showcase site

Static marketing/lookbook site for **Reaching Dreams**, hosted on GitHub Pages.
Completely independent of Shopify — no Liquid, no server, no build step.

**Live → https://varsansri.github.io/reachingdreams-site/**

## Links

| | |
|---|---|
| **Live Shopify store** | https://xu3h0v-gg.myshopify.com |
| Shopify admin | https://admin.shopify.com/store/xu3h0v-gg |
| Theme source repo | https://github.com/varsansri/reachingdreams-store |
| This site repo | https://github.com/varsansri/reachingdreams-site |

## How it works

- `index.html` / `styles.css` / `app.js` — plain HTML, CSS, and vanilla JS. No frameworks, no dependencies.
- `products.json` — product data **exported from the Shopify store at build time**. The site reads this file; it never calls Shopify at runtime.
- Purchases hand off to the Shopify store, which owns cart, checkout, and orders.

This split is deliberate: GitHub Pages serves static files only, so it cannot run
Liquid or process payments. The site is a fast, free, independently-hosted shop
window; Shopify remains the commerce backend.

## Refreshing product data

When products or prices change in Shopify, re-export:

```bash
shopify store execute -s xu3h0v-gg.myshopify.com -j \
  --query-file export.graphql --output-file products_raw.json
# then re-run the transform that writes products.json
```

Commit the updated `products.json` and Pages redeploys automatically.

## Mirrors the Shopify homepage

Section order and copy match `templates/index.json` on theme `#164834902228`:

`announcement → hero → ticker → drop countdown → category tiles → NEW DROPS → BESTSELLERS → story → signup`

Same palette too — `#FFC300` CTAs, `#E63946` sale badges, 6px radii, `#111` ink.

Differences are only where a static site cannot follow: no cart or checkout
(buy links hand off to Shopify), and the signup form has no mailing list behind it.

## Features

- Live countdown to the next drop, flipping to "LIVE NOW" at zero
- Category tiles and two product rows, populated from `products.json`
- Hover swaps to the second product image
- Quick-view dialog with description, size run, and a buy link
- Discount badges calculated from compare-at prices
- Animated ticker and film-grain drop section
- Honours `prefers-reduced-motion`; keyboard accessible with a skip link

## Related

Theme source for the Shopify store itself lives in
[`reachingdreams-store`](https://github.com/varsansri/reachingdreams-store).
