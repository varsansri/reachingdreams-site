# Reaching Dreams — showcase site

Static marketing/lookbook site for **Reaching Dreams**, hosted on GitHub Pages.
Completely independent of Shopify — no Liquid, no server, no build step.

**Live → https://varsansri.github.io/reachingdreams-site/**

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

## Features

- Responsive product grid with category filtering (All / New Drops / Bestsellers / Oversized / Graphic)
- Hover swaps to the second product image
- Quick-view dialog with description, size run, and a buy link
- Automatic discount badges calculated from compare-at prices
- Animated ticker and film-grain hero
- Honours `prefers-reduced-motion`; keyboard accessible with a skip link

## Related

Theme source for the Shopify store itself lives in
[`reachingdreams-store`](https://github.com/varsansri/reachingdreams-store).
