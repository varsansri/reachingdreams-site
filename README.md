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

## Pages

| File | What it is |
|---|---|
| `index.html` | Homepage — hero carousel, USP strip, New In banners, New Arrivals rail, category tiles, bestsellers grid |
| `collection.html` | Listing page with faceted left rail. Accepts `?tag=`, `?q=`, `?wish=1` |
| `product.html` | Product page. Accepts `?p=<handle>` |

Header, nav drawer, bag drawer and footer are rendered once from `app.js` so all
three pages share one copy.

## Layout system

Built on the large-format Indian D2C apparel pattern: centered logo with gender
tabs in the header, a peek carousel (78% wide slides with the next one showing),
mint USP band, uppercase letter-spaced section headings, 3:4 product cards with
a fit badge top-left and a fabric badge bottom-left, and a counted facet rail
(size chips, colour swatches, category / fit / theme checkboxes) on the PLP.

Every colour resolves from `--accent` and the tokens at the top of `styles.css` —
change `--accent` alone and the whole site re-skins.

## Features

- Faceted filtering with live counts that respect the other active facets
- Sort by relevance / new / price
- Bag drawer in `localStorage`; checkout hands off to Shopify
- Wishlist toggles on any card, `collection.html?wish=1` lists them
- Search box filters title, category, theme and description
- Discount badges calculated from compare-at prices
- Auto-advancing hero with arrows and dots; full mobile layout with a filter drawer

## Related

Theme source for the Shopify store itself lives in
[`reachingdreams-store`](https://github.com/varsansri/reachingdreams-store).
