console.log("products.js cargó ✅");

const root = document.getElementById("productRoot");

const moneyCRC = (n) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(n);

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  root.innerHTML = `<div class="alert alert-danger">
    Falta el id del producto en la URL. Abrí el producto desde panties.html (clic en una card).
  </div>`;
  throw new Error("Falta id en la URL");
}

// ✅ AQUÍ es donde estaba el error: NO panties.json, SÍ product.json
fetch("data/product.json")
  .then((r) => {
    if (!r.ok) throw new Error("No se pudo abrir data/product.json (HTTP " + r.status + ")");
    return r.json();
  })
  .then((products) => {
    const p = products.find((x) => String(x.id) === String(id));
    if (!p) {
      root.innerHTML = `<div class="alert alert-danger">Producto no encontrado (id: ${id}).</div>`;
      return;
    }
    root.innerHTML = productHTML(p);
  })
  .catch((err) => {
    console.error(err);
    root.innerHTML = `<div class="alert alert-danger">Error cargando producto: ${err.message}</div>`;
  });

function productHTML(p) {
  const main = p.images?.[0] ?? "";
  const thumbs = (p.images ?? [])
    .map(
      (img) => `
        <img src="${img}" class="img-thumbnail me-2"
          style="width:70px;height:70px;object-fit:cover;cursor:pointer"
          onclick="document.getElementById('mainProductImg').src='${img}'">
      `
    )
    .join("");

  return `
    <div class="container my-4">
      <div class="row g-4">
        <div class="col-md-6">
          <img id="mainProductImg" src="${main}" class="img-fluid w-100" alt="${p.title}">
          <div class="mt-3 d-flex flex-wrap">${thumbs}</div>
        </div>

        <div class="col-md-6">
          <h2 class="mb-2">${p.title}</h2>

          <div class="mb-3">
            <span class="fs-4 fw-semibold">${moneyCRC(p.price)}</span>
            ${
              p.oldPrice
                ? `<span class="ms-2 text-muted text-decoration-line-through">${moneyCRC(p.oldPrice)}</span>`
                : ""
            }
          </div>

          <button class="btn btn-outline-dark w-100 mb-2">AÑADIR AL CARRITO</button>
          <button class="btn btn-secondary w-100">COMPRAR AHORA</button>
        </div>
      </div>
    </div>
  `;
}
