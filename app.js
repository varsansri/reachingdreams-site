/* Reaching Dreams storefront — vanilla JS, no build step.
   Product data comes from products.json (exported from Shopify).
   Checkout hands off to the Shopify store; this site never handles payment. */

const SHOP = 'https://xu3h0v-gg.myshopify.com';
const rupees = n => '₹ ' + Number(n).toLocaleString('en-IN');
const qs = new URLSearchParams(location.search);
const store = {
  get bag() { try { return JSON.parse(localStorage.getItem('rd_bag')) || []; } catch { return []; } },
  set bag(v) { localStorage.setItem('rd_bag', JSON.stringify(v)); },
  get wish() { try { return JSON.parse(localStorage.getItem('rd_wish')) || []; } catch { return []; } },
  set wish(v) { localStorage.setItem('rd_wish', JSON.stringify(v)); }
};

/* ---------- icons ---------- */

const icon = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20s-7.5-4.7-7.5-9.4A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.5 3C19.5 15.3 12 20 12 20z"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 8h16l-1.3 12H5.3z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 4v5h-5"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6A22 22 0 0 0 14.3 3.5c-2.4 0-4 1.45-4 4.1V9.9H7.6V13h2.7v8z"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 3h3l-6.6 7.5L21.7 21h-6l-4.3-5.6L6.4 21H3.3l7-8L2.6 3h6.2l3.9 5.2zm-1.1 16.2h1.7L7.7 4.7H5.9z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3zm5.2 12.7c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-3-.8s-3.3-3-3.4-3.2c-.1-.2-.9-1.2-.9-2.3s.6-1.6.8-1.8.4-.3.6-.3h.5c.2 0 .4-.1.6.4l.8 1.9c.1.2.1.4 0 .5l-.4.5c-.1.2-.3.3-.1.6s.6 1 1.3 1.6c.9.8 1.6 1 1.8 1.1s.4.1.5-.1l.7-.8c.2-.2.3-.2.6-.1l1.7.8c.2.1.4.2.5.3s.1.6-.1 1.2z"/></svg>'
};

/* ---------- chrome ---------- */

function renderChrome() {
  const bagCount = store.bag.reduce((n, l) => n + l.qty, 0);
  document.getElementById('chrome-header').innerHTML = `
  <header class="header">
    <div class="header-left">
      <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
      <nav class="tabs">
        <a href="collection.html" class="active">MEN</a>
        <a href="collection.html?tag=oversized">OVERSIZED</a>
        <a href="collection.html?tag=new-drops">NEW DROPS</a>
      </nav>
    </div>
    <a class="brand" href="index.html"><img src="assets/rd-logo-on-light.png" alt="Reaching Dreams"></a>
    <div class="header-right">
      <form class="search" action="collection.html">
        <input name="q" placeholder="What are you looking for?" value="${esc(qs.get('q') || '')}">
        <button aria-label="Search">${icon.search}</button>
      </form>
      <a class="icon-btn" href="${SHOP}/account" aria-label="Account">${icon.user}</a>
      <a class="icon-btn" href="collection.html?wish=1" aria-label="Wishlist">${icon.heart}</a>
      <button class="icon-btn" id="open-bag" aria-label="Bag">${icon.bag}
        <span class="bag-count" ${bagCount ? '' : 'hidden'}>${bagCount}</span>
      </button>
    </div>
  </header>

  <div class="scrim" id="scrim"></div>

  <nav class="drawer" id="drawer">
    <h4>Shop</h4>
    <a href="collection.html">All T-Shirts</a>
    <a href="collection.html?tag=oversized">Oversized T-Shirts</a>
    <a href="collection.html?tag=graphic">Graphic Tees</a>
    <a href="collection.html?tag=new-drops">New Drops</a>
    <a href="collection.html?tag=bestsellers">Bestsellers</a>
    <h4>Help</h4>
    <a href="${SHOP}/pages/contact">Contact us</a>
    <a href="${SHOP}/pages/shipping-policy">Shipping &amp; returns</a>
    <a href="${SHOP}/pages/size-guide">Size guide</a>
    <a href="${SHOP}">Track order</a>
  </nav>

  <aside class="bag" id="bag">
    <header>Your bag <button id="close-bag" aria-label="Close">✕</button></header>
    <div class="bag-items" id="bag-items"></div>
    <div class="bag-foot">
      <div class="bag-total"><span>Total</span><span id="bag-total">₹ 0</span></div>
      <button class="btn btn-primary" id="checkout">Checkout</button>
      <p>Checkout is completed on our secure Shopify store.</p>
    </div>
  </aside>`;

  document.getElementById('chrome-footer').innerHTML = `
  <footer class="footer">
    <div class="wrap">
      <div class="footer-cols">
        <div>
          <h4>Need help</h4>
          <a href="${SHOP}/pages/contact">Contact us</a>
          <a href="${SHOP}">Track order</a>
          <a href="${SHOP}/pages/refund-policy">Returns &amp; refunds</a>
          <a href="${SHOP}/pages/faq">FAQs</a>
          <a href="${SHOP}/account">My account</a>
        </div>
        <div>
          <h4>Company</h4>
          <a href="${SHOP}/pages/about-us">About us</a>
          <a href="${SHOP}/pages/contact">Careers</a>
          <a href="${SHOP}/pages/contact">Collaborate</a>
          <a href="${SHOP}/pages/contact">Bulk orders</a>
        </div>
        <div>
          <h4>More info</h4>
          <a href="${SHOP}/policies/terms-of-service">T&amp;C</a>
          <a href="${SHOP}/policies/privacy-policy">Privacy policy</a>
          <a href="${SHOP}/policies/shipping-policy">Shipping policy</a>
          <a href="collection.html">Sitemap</a>
        </div>
        <div>
          <h4>Made in India</h4>
          <a href="collection.html?tag=oversized">Oversized T-Shirts</a>
          <a href="collection.html?tag=graphic">Graphic Tees</a>
          <a href="collection.html?tag=bestsellers">Bestsellers</a>
          <a href="collection.html?tag=new-drops">New Drops</a>
        </div>
      </div>
      <div class="footer-perks">
        <div>${icon.truck}<span>Free shipping over ₹999</span></div>
        <div>${icon.refresh}<span>7 days easy returns &amp; exchanges</span></div>
      </div>
      <div class="socials">
        <span style="color:#555;font-size:12px">Follow us:</span>
        <a href="https://instagram.com" aria-label="Instagram">${icon.ig}</a>
        <a href="https://facebook.com" aria-label="Facebook">${icon.fb}</a>
        <a href="https://x.com" aria-label="X">${icon.x}</a>
        <a href="https://wa.me/917695971495" aria-label="WhatsApp">${icon.wa}</a>
      </div>
      <details class="who">
        <summary>Who we are <span>+</span></summary>
        <p>Reaching Dreams is a homegrown Indian clothing label built for people who are still
        building something. We print heavyweight oversized tees and graphic tees in India, in small
        runs, and ship them across the country with cash on delivery and 7-day returns. Every drop
        starts as a line someone needed to read on a hard day — then it goes on a shirt.</p>
      </details>
      <p class="legal">© Reaching Dreams ${new Date().getFullYear()} · Printed and shipped in India</p>
    </div>
  </footer>`;

  wireChrome();
}

function wireChrome() {
  const drawer = document.getElementById('drawer');
  const bag = document.getElementById('bag');
  const scrim = document.getElementById('scrim');
  const filters = document.getElementById('filters');
  const closeAll = () => {
    drawer.classList.remove('open');
    bag.classList.remove('open');
    if (filters) filters.classList.remove('open');
    scrim.classList.remove('open');
  };
  const open = el => { el.classList.add('open'); scrim.classList.add('open'); };

  document.getElementById('burger').onclick = () => open(drawer);
  document.getElementById('open-bag').onclick = () => { renderBag(); open(bag); };
  document.getElementById('close-bag').onclick = closeAll;
  scrim.onclick = closeAll;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
  document.getElementById('checkout').onclick = () => {
    const lines = store.bag;
    if (!lines.length) return;
    location.href = lines.length === 1 ? lines[0].url : SHOP + '/collections/all';
  };
  const ft = document.getElementById('filter-toggle');
  if (ft && filters) ft.onclick = () => open(filters);
}

/* ---------- bag ---------- */

function addToBag(p, size) {
  const bag = store.bag;
  const key = p.handle + '|' + size;
  const line = bag.find(l => l.key === key);
  if (line) line.qty++;
  else bag.push({ key, handle: p.handle, title: p.title, size, price: p.price, img: p.images[0], url: p.url, qty: 1 });
  store.bag = bag;
  renderBag();
  const c = document.querySelector('.bag-count');
  const n = bag.reduce((s, l) => s + l.qty, 0);
  c.textContent = n;
  c.hidden = !n;
  document.getElementById('bag').classList.add('open');
  document.getElementById('scrim').classList.add('open');
}

function renderBag() {
  const bag = store.bag;
  const box = document.getElementById('bag-items');
  box.innerHTML = bag.length ? bag.map(l => `
    <div class="bag-item">
      <img src="${l.img}" alt="">
      <div>
        <b>${esc(l.title)}</b>
        <small>Size ${l.size} · Qty ${l.qty}</small>
      </div>
      <div style="text-align:right">
        ${rupees(l.price * l.qty)}
        <button style="display:block;margin-top:6px;color:#7a7a7a;font-size:12px" data-rm="${l.key}">Remove</button>
      </div>
    </div>`).join('') : '<p class="empty">Your bag is empty.</p>';
  document.getElementById('bag-total').textContent = rupees(bag.reduce((s, l) => s + l.price * l.qty, 0));
  box.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => {
    store.bag = store.bag.filter(l => l.key !== b.dataset.rm);
    renderBag();
    const c = document.querySelector('.bag-count');
    const n = store.bag.reduce((s, l) => s + l.qty, 0);
    c.textContent = n;
    c.hidden = !n;
  });
}

/* ---------- cards ---------- */

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function card(p) {
  const off = p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
  const wished = store.wish.includes(p.handle);
  return `
  <a class="card" href="product.html?p=${p.handle}">
    <div class="card-media">
      <img src="${p.images[0]}" alt="${esc(p.title)}" loading="lazy">
      <span class="fit-badge">${esc(p.fit)}</span>
      <span class="fabric-badge">${esc(p.fabric)}</span>
      <button class="wish ${wished ? 'on' : ''}" data-wish="${p.handle}" aria-label="Wishlist">${icon.heart}</button>
    </div>
    <div class="card-body">
      <div class="card-title">${esc(p.title)}</div>
      <div class="card-cat">${esc(p.category)}</div>
      <div class="card-price">
        <span>${rupees(p.price)}</span>
        ${p.compareAt ? `<s>${rupees(p.compareAt)}</s><em>${off}% off</em>` : ''}
      </div>
    </div>
  </a>`;
}

function wireCards(root) {
  root.querySelectorAll('[data-wish]').forEach(b => b.onclick = e => {
    e.preventDefault();
    const h = b.dataset.wish;
    const w = store.wish;
    store.wish = w.includes(h) ? w.filter(x => x !== h) : w.concat(h);
    b.classList.toggle('on');
  });
}

/* ---------- carousel ---------- */

function carousel(id) {
  const track = document.getElementById(id);
  const dots = document.querySelector(`[data-dots="${id}"]`);
  if (!track) return;
  const slides = [...track.children];
  const step = () => track.clientWidth * 0.78 + 14;
  dots.innerHTML = slides.map((_, i) => `<button data-i="${i}"></button>`).join('');
  const mark = () => {
    const i = Math.round(track.scrollLeft / step());
    dots.querySelectorAll('button').forEach((b, j) => b.classList.toggle('on', j === i));
  };
  track.addEventListener('scroll', () => requestAnimationFrame(mark), { passive: true });
  dots.querySelectorAll('button').forEach(b => b.onclick = () => track.scrollTo({ left: b.dataset.i * step() }));
  document.querySelectorAll(`[data-car="${id}"]`).forEach(b => b.onclick = () => {
    track.scrollBy({ left: Number(b.dataset.dir) * step() });
  });
  mark();
  setInterval(() => {
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 20;
    track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + step() });
  }, 6000);
}

/* ---------- pages ---------- */

const CATEGORY_TILES = [
  { label: 'Oversized', tag: 'oversized', img: 'assets/products/built-different-oversized-tee-1.jpg' },
  { label: 'Graphic Tees', tag: 'graphic', img: 'assets/products/chai-code-classic-tee-1.jpg' },
  { label: 'New Drops', tag: 'new-drops', img: 'assets/products/ship-it-oversized-tee-1.jpg' },
  { label: 'Bestsellers', tag: 'bestsellers', img: 'assets/products/founder-era-heavyweight-tee-1.jpg' },
  { label: 'Black Edit', tag: 'oversized', img: 'assets/products/dream-loud-oversized-tee-1.jpg' },
  { label: 'White Edit', tag: 'graphic', img: 'assets/products/0-to-1-graphic-tee-1.jpg' }
];

function pageHome(products) {
  const railNew = document.getElementById('rail-new');
  const newFirst = products.filter(p => p.tags.includes('new-drops'))
    .concat(products.filter(p => !p.tags.includes('new-drops')));
  railNew.innerHTML = newFirst.map(card).join('');
  document.getElementById('grid-best').innerHTML =
    products.filter(p => p.tags.includes('bestsellers')).map(card).join('');
  document.getElementById('cats').innerHTML = CATEGORY_TILES.map(c => `
    <a class="cat-tile" href="collection.html?tag=${c.tag}">
      <img src="${c.img}" alt="${c.label}" loading="lazy"><span>${c.label}</span>
    </a>`).join('');
  wireCards(document);
  carousel('hero');
}

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const FACETS = [
  { key: 'size', label: 'Size', chips: true, values: p => p.sizes, sort: (a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b) },
  { key: 'color', label: 'Colour', swatch: true, values: p => [p.color] },
  { key: 'category', label: 'Category', values: p => [p.category] },
  { key: 'fit', label: 'Fit', values: p => [p.fit] },
  { key: 'theme', label: 'Theme', values: p => [p.theme] }
];
const SWATCH = { Black: '#111', White: '#fff', Grey: '#9a9a9a' };

function pageCollection(products) {
  const active = {};
  FACETS.forEach(f => active[f.key] = new Set());
  const tag = qs.get('tag');
  const q = (qs.get('q') || '').trim().toLowerCase();
  const wishOnly = qs.get('wish') === '1';

  let base = products;
  if (tag) base = base.filter(p => p.tags.includes(tag));
  if (q) base = base.filter(p => (p.title + ' ' + p.category + ' ' + p.theme + ' ' + p.desc).toLowerCase().includes(q));
  if (wishOnly) base = base.filter(p => store.wish.includes(p.handle));

  const titles = { oversized: 'Oversized T-Shirts', graphic: 'Graphic Tees', 'new-drops': 'New Drops', bestsellers: 'Bestsellers' };
  const title = wishOnly ? 'Your Wishlist' : q ? `Search: ${q}` : (titles[tag] || 'Men T-Shirts');
  document.getElementById('plp-title').textContent = title;
  document.getElementById('crumb-now').textContent = title;
  document.title = title + ' — Reaching Dreams';

  const matches = p => FACETS.every(f => !active[f.key].size || f.values(p).some(v => active[f.key].has(v)));

  function draw() {
    let list = base.filter(matches);
    const sort = document.getElementById('sort').value;
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'new') list = [...list].sort((a, b) => Number(b.tags.includes('new-drops')) - Number(a.tags.includes('new-drops')));

    document.getElementById('plp-grid').innerHTML = list.map(card).join('');
    document.getElementById('plp-count').textContent = `- ${list.length} item${list.length === 1 ? '' : 's'}`;
    document.getElementById('plp-empty').hidden = list.length > 0;
    wireCards(document.getElementById('plp-grid'));

    // counts reflect what each option would return alongside the other active facets
    const genderGroup = `<div class="fgroup"><h5>Gender</h5>
      <label class="frow"><input type="radio" name="g" checked><span>Men</span><span class="count">${base.length}</span></label>
      <label class="frow"><input type="radio" name="g" disabled><span>Women</span><span class="count">0</span></label>
    </div>`;

    document.getElementById('filters').innerHTML = genderGroup + FACETS.map(f => {
      const others = p => FACETS.every(g => g.key === f.key || !active[g.key].size || g.values(p).some(v => active[g.key].has(v)));
      const pool = base.filter(others);
      const opts = [...new Set(pool.flatMap(f.values))].sort(f.sort);
      if (!opts.length) return '';
      const rows = opts.map(v => {
        const n = pool.filter(p => f.values(p).includes(v)).length;
        const on = active[f.key].has(v);
        if (f.chips) return `<button class="chip ${on ? 'on' : ''}" data-f="${f.key}" data-v="${esc(v)}">${esc(v)} <small>(${n})</small></button>`;
        return `<label class="frow">
          <input type="checkbox" data-f="${f.key}" data-v="${esc(v)}" ${on ? 'checked' : ''}>
          ${f.swatch ? `<span class="sw" style="background:${SWATCH[v] || '#ddd'}"></span>` : ''}
          <span>${esc(v)}</span><span class="count">${n}</span>
        </label>`;
      }).join('');
      return `<div class="fgroup"><h5>${f.label}</h5>${f.chips ? `<div class="chips">${rows}</div>` : rows}</div>`;
    }).join('');

    document.querySelectorAll('#filters [data-f]').forEach(el => {
      el.addEventListener(el.tagName === 'INPUT' ? 'change' : 'click', () => {
        const set = active[el.dataset.f];
        set.has(el.dataset.v) ? set.delete(el.dataset.v) : set.add(el.dataset.v);
        draw();
      });
    });
  }

  document.getElementById('sort').onchange = draw;
  draw();
}

function pageProduct(products) {
  const p = products.find(x => x.handle === qs.get('p')) || products[0];
  const off = p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
  document.title = p.title + ' — Reaching Dreams';
  document.getElementById('crumb-now').textContent = p.title;

  document.getElementById('pdp').innerHTML = `
    <div class="pdp-gallery ${p.images.length < 2 ? 'single' : ''}">
      ${p.images.map(src => `<img src="${src}" alt="${esc(p.title)}">`).join('')}
    </div>
    <div class="pdp-info">
      <h1>${esc(p.title)}</h1>
      <div class="pdp-cat">${esc(p.category)} · ${esc(p.fit)}</div>
      <div class="pdp-price">
        <span>${rupees(p.price)}</span>
        ${p.compareAt ? `<s>${rupees(p.compareAt)}</s><em>${off}% off</em>` : ''}
      </div>
      <div class="tax">Inclusive of all taxes</div>
      <div class="size-head">Select size</div>
      <div class="sizes">${p.sizes.map(s => `<button class="size" data-size="${s}">${s}</button>`).join('')}</div>
      <div class="actions">
        <button class="btn btn-ghost" id="add">Add to bag</button>
        <a class="btn btn-primary" href="${p.url}" style="display:grid;place-items:center">Buy now</a>
      </div>
      <div class="footer-perks" style="margin-top:18px">
        <div>${icon.truck}<span>Free shipping over ₹999</span></div>
        <div>${icon.refresh}<span>7 days returns</span></div>
      </div>
      <div class="pdp-notes">
        <details open><summary>Description <span>−</span></summary><p>${esc(p.desc)}</p></details>
        <details><summary>Fabric &amp; care <span>+</span></summary><p>${esc(p.fabric)}. Machine wash cold, inside out. Do not bleach. Tumble dry low. Iron on reverse, never directly on the print.</p></details>
        <details><summary>Shipping &amp; returns <span>+</span></summary><p>Dispatched in 2–3 working days, delivered across India in 4–7. Cash on delivery available. 7-day easy returns and exchanges on unworn items with tags intact.</p></details>
      </div>
    </div>`;

  let size = null;
  document.querySelectorAll('.size').forEach(b => b.onclick = () => {
    document.querySelectorAll('.size').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    size = b.dataset.size;
  });
  document.getElementById('add').onclick = () => {
    if (!size) {
      document.querySelector('.size-head').style.color = 'var(--accent)';
      document.querySelector('.size-head').textContent = 'Select size to continue';
      return;
    }
    addToBag(p, size);
  };

  const more = products.filter(x => x.handle !== p.handle).slice(0, 6);
  document.getElementById('rail-more').innerHTML = more.map(card).join('');
  wireCards(document);
}

/* ---------- boot ---------- */

renderChrome();
fetch('products.json')
  .then(r => r.json())
  .then(products => {
    const page = document.body.dataset.page;
    if (page === 'home') pageHome(products);
    if (page === 'collection') pageCollection(products);
    if (page === 'product') pageProduct(products);
  })
  .catch(() => {
    const m = document.querySelector('main');
    if (m) m.insertAdjacentHTML('afterbegin', '<p class="empty">Could not load products. Please refresh.</p>');
  });
