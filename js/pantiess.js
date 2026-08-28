console.log("pantiess.js cargó ✅");

const grid = document.getElementById("pantiesGrid");

if (!grid) {
  console.error("No existe #pantiesGrid en el HTML");
} else {
  fetch("data/product.json")
    .then((r) => {
      if (!r.ok) throw new Error(`No se pudo abrir data/product.json (HTTP ${r.status})`);
      return r.json();
    })
    .then((products) => {
      grid.innerHTML = products.map(cardHTML).join("");
      // DEBUG: ver enlaces generados
      document.querySelectorAll('a.stretched-link[href^="product.html"]').forEach(a => console.log("Link:", a.href));
    })
    .catch((err) => {
      console.error(err);
      grid.innerHTML = `<div class="col-12 text-danger">Error cargando productos. Revisa ruta y consola.</div>`;
    });
}

const moneyCRC = (n) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

function cardHTML(p) {
  const img = p.images?.[0] ?? "";
  const href = `product.html?id=${encodeURIComponent(p.id)}`;

  return `
    <div class="col">
      <div class="card product-card h-100 position-relative">
        <img src="${img}" class="card-img-top" alt="${escapeHtml(p.title)}">

        ${p.discount ? `<span class="badge bg-danger position-absolute top-0 start-0 m-2">${p.discount}% OFF</span>` : ""}

        <!-- Hace toda la card clickeable SIN anidar links -->
        <a class="stretched-link" href="${href}" aria-label="Ver ${escapeHtml(p.title)}"></a>

        <div class="card-body p-2">
          <div class="product-title">${escapeHtml(p.title)}</div>
          <div class="product-price">
            <span class="product-new-price">${moneyCRC(p.price)}</span>
            ${p.oldPrice ? `<span class="product-old-price ms-2 text-muted text-decoration-line-through">${moneyCRC(p.oldPrice)}</span>` : ""}
          </div>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[m]));
}
