/* Reaching Dreams — static mirror of the Shopify homepage.
   Product data is baked into products.json at build time. */

const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const STORE = 'https://xu3h0v-gg.myshopify.com';

const inr = (n) => '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });

let PRODUCTS = [];

/* ------------------------------------------------------------ countdown */
(function countdown() {
  const el = document.getElementById('timer');
  if (!el) return;
  const deadline = Date.parse(el.dataset.deadline);
  if (Number.isNaN(deadline)) return el.setAttribute('hidden', '');

  const pad = (n) => String(n).padStart(2, '0');

  function tick() {
    const diff = deadline - Date.now();
    if (diff <= 0) {
      el.innerHTML = '<span class="drop__live">LIVE NOW</span>';
      return true;
    }
    const s = Math.floor(diff / 1000);
    const map = {
      days: Math.floor(s / 86400),
      hours: Math.floor((s % 86400) / 3600),
      mins: Math.floor((s % 3600) / 60),
      secs: s % 60,
    };
    for (const [unit, v] of Object.entries(map)) {
      const node = el.querySelector(`[data-unit="${unit}"]`);
      if (node) node.textContent = pad(v);
    }
    return false;
  }

  if (tick()) return;
  const id = setInterval(() => { if (tick()) clearInterval(id); }, 1000);
})();

/* ------------------------------------------------------------- rendering */
const COLLECTIONS = [
  { tag: 'new-drops', title: 'New Drops' },
  { tag: 'bestsellers', title: 'Bestsellers' },
  { tag: 'oversized', title: 'Oversized Fit' },
  { tag: 'graphic', title: 'Graphic Tees' },
];

function byTag(tag) {
  return PRODUCTS.filter((p) => p.tags.includes(tag));
}

function cardMarkup(p) {
  const i = PRODUCTS.indexOf(p);
  const off = p.compareAt ? Math.round(((p.compareAt - p.price) / p.compareAt) * 100) : 0;
  const imgs = p.images.length ? p.images : [''];
  return `
    <button class="card" data-i="${i}" aria-label="View ${p.title}">
      <span class="card__media">
        ${off ? `<span class="badge">${off}% off</span>` : ''}
        <img src="${imgs[0]}" alt="${p.title}" loading="lazy" width="800" height="1000">
        ${imgs[1] ? `<img src="${imgs[1]}" alt="" aria-hidden="true" loading="lazy" width="800" height="1000">` : ''}
      </span>
      <span class="card__title">${p.title}</span>
      <span class="card__price">
        ${inr(p.price)}
        ${p.compareAt ? `<span class="card__was">${inr(p.compareAt)}</span>` : ''}
      </span>
    </button>`;
}

function renderGrids() {
  document.querySelectorAll('.grid[data-collection]').forEach((el) => {
    const list = byTag(el.dataset.collection);
    el.innerHTML = list.map(cardMarkup).join('') ||
      '<p style="color:#5a5a5a">Nothing here yet.</p>';
  });
}

function renderCategories() {
  const wrap = document.getElementById('cats');
  if (!wrap) return;
  wrap.innerHTML = COLLECTIONS.map((c) => {
    const items = byTag(c.tag);
    const img = items[0]?.images[0] || '';
    const handle = c.tag === 'oversized' ? 'oversized-fit'
      : c.tag === 'graphic' ? 'graphic-tees' : c.tag;
    return `
      <a class="tile" href="${STORE}/collections/${handle}" target="_blank" rel="noopener">
        <img src="${img}" alt="${c.title}" loading="lazy">
        <span class="tile__label">${c.title}
          <span class="tile__count">${items.length} product${items.length === 1 ? '' : 's'}</span>
        </span>
      </a>`;
  }).join('');
}

/* ----------------------------------------------------------- quick view */
function openProduct(p) {
  const off = p.compareAt ? Math.round(((p.compareAt - p.price) / p.compareAt) * 100) : 0;
  modalBody.innerHTML = `
    <div class="modal__media"><img src="${p.images[0] || ''}" alt="${p.title}"></div>
    <div class="modal__info">
      <h3>${p.title}</h3>
      <p class="modal__price">
        ${inr(p.price)}
        ${p.compareAt ? `<span class="card__was">${inr(p.compareAt)}</span>` : ''}
        ${off ? `<span class="badge" style="position:static">${off}% off</span>` : ''}
      </p>
      <p class="modal__desc">${p.desc}</p>
      <div class="sizes">${p.sizes.map((s) => `<span>${s}</span>`).join('')}</div>
      <a class="btn btn--primary" href="${p.url}" target="_blank" rel="noopener">Buy on our store ↗</a>
    </div>`;
  if (typeof modal.showModal === 'function') modal.showModal();
}

document.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (card) openProduct(PRODUCTS[Number(card.dataset.i)]);
});
document.getElementById('close').addEventListener('click', () => modal.close());
modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });

/* --------------------------------------------------------------- signup */
document.getElementById('signupForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const note = document.getElementById('signupNote');
  note.hidden = false;
  note.textContent = 'This showcase site has no mailing list — sign up on the store to get drop alerts.';
});

document.getElementById('yr').textContent = new Date().getFullYear();

/* ----------------------------------------------------------------- boot */
fetch('products.json')
  .then((r) => { if (!r.ok) throw new Error(`products.json ${r.status}`); return r.json(); })
  .then((data) => {
    PRODUCTS = data;
    renderCategories();
    renderGrids();
  })
  .catch((err) => {
    console.error(err);
    document.querySelectorAll('.grid').forEach((el) => {
      el.innerHTML = '<p style="color:#5a5a5a">Could not load products. Visit the store directly.</p>';
    });
  });
