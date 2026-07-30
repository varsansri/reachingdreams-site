/* Reaching Dreams — product grid, filtering, and quick-view.
   Data is baked at build time into products.json (exported from Shopify). */

const grid = document.getElementById('grid');
const empty = document.getElementById('empty');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');

const inr = (n) =>
  '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });

let PRODUCTS = [];
let filter = 'all';

function cardMarkup(p, i) {
  const off = p.compareAt
    ? Math.round(((p.compareAt - p.price) / p.compareAt) * 100)
    : 0;
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

function render() {
  const list = PRODUCTS.filter(
    (p) => filter === 'all' || p.tags.includes(filter)
  );
  grid.innerHTML = list
    .map((p) => cardMarkup(p, PRODUCTS.indexOf(p)))
    .join('');
  empty.hidden = list.length > 0;
}

function openProduct(p) {
  const off = p.compareAt
    ? Math.round(((p.compareAt - p.price) / p.compareAt) * 100)
    : 0;
  modalBody.innerHTML = `
    <div class="modal__media">
      <img src="${p.images[0] || ''}" alt="${p.title}">
    </div>
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

grid.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (card) openProduct(PRODUCTS[Number(card.dataset.i)]);
});

document.getElementById('close').addEventListener('click', () => modal.close());
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.close(); // click outside the panel
});

document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach((c) => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    filter = chip.dataset.filter;
    render();
  });
});

document.getElementById('yr').textContent = new Date().getFullYear();

fetch('products.json')
  .then((r) => {
    if (!r.ok) throw new Error(`products.json ${r.status}`);
    return r.json();
  })
  .then((data) => {
    PRODUCTS = data;
    render();
  })
  .catch((err) => {
    console.error(err);
    grid.innerHTML =
      '<p style="color:#6b6b6b">Could not load products. Visit the store directly.</p>';
  });
