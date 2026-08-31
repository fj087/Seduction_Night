// =====================================================
// products.js
// Este archivo se usa en product.html
// Su función es:
// 1. Leer el ID del producto desde la URL
// 2. Buscar ese producto en data/product.json
// 3. Mostrar la información del producto
// 4. Manejar galería de imágenes
// 5. Agregar producto al carrito
// 6. Comprar ahora
// =====================================================

console.log("products.js cargó ✅");

// Aquí buscamos el contenedor donde se va a pintar el producto.
// En product.html debe existir: <main id="productRoot"></main>
const root = document.getElementById("productRoot");

// =====================================================
// FUNCIÓN: moneyCRC
// Convierte un número a formato de moneda en colones.
// Ejemplo: 12000 → ₡12 000
// =====================================================
const moneyCRC = (n) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

// =====================================================
// LEER EL ID DEL PRODUCTO DESDE LA URL
// Ejemplo de URL:
// product.html?id=set-sensacion
// Aquí obtenemos: set-sensacion
// =====================================================
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Si no viene un id en la URL, mostramos error.
if (!id) {
  root.innerHTML = `
    <div class="alert alert-danger">
      Falta el id del producto en la URL. Abrí el producto desde panties.html.
    </div>
  `;

  throw new Error("Falta id en la URL");
}

// =====================================================
// CARGAR PRODUCTOS DESDE product.json
// Aquí se abre el archivo data/product.json
// y luego se busca el producto según el id de la URL.
// =====================================================
fetch("data/product.json")
  .then((r) => {
    // Si el archivo no carga correctamente, mostramos error.
    if (!r.ok) {
      throw new Error("No se pudo abrir data/product.json (HTTP " + r.status + ")");
    }

    // Convertimos la respuesta a JSON.
    return r.json();
  })
  .then((products) => {
    // Buscamos dentro del JSON el producto que tenga el mismo id de la URL.
    const p = products.find((x) => String(x.id) === String(id));

    // Si no existe el producto, mostramos mensaje.
    if (!p) {
      root.innerHTML = `
        <div class="alert alert-danger">
          Producto no encontrado (id: ${id}).
        </div>
      `;
      return;
    }

    // Pintamos el producto en pantalla usando la función productHTML.
    root.innerHTML = productHTML(p);

    // Activamos las flechas y miniaturas de la galería.
    setupGallery(p.images ?? []);

    // Conectamos el botón "AÑADIR AL CARRITO".
    const addToCartBtn = document.getElementById("addToCartBtn");

    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        addToCart(p);
      });
    }

    // Conectamos el botón "COMPRAR AHORA".
    const buyNowBtn = document.getElementById("buyNowBtn");

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", () => {
        buyNow(p);
      });
    }
  })
  .catch((err) => {
    // Si ocurre cualquier error, lo mostramos en consola y en pantalla.
    console.error(err);

    root.innerHTML = `
      <div class="alert alert-danger">
        Error cargando producto: ${err.message}
      </div>
    `;
  });

// =====================================================
// FUNCIÓN: productHTML
// Esta función recibe un producto y construye todo el HTML
// que se muestra en product.html.
// Aquí se crea:
// - Imagen principal
// - Flechas izquierda/derecha
// - Miniaturas
// - Nombre del producto
// - Descripción
// - Precio
// - Botón añadir al carrito
// - Botón comprar ahora
// =====================================================
function productHTML(p) {
  // Tomamos la primera imagen como imagen principal.
  const main = p.images?.[0] ?? "";

  //Agregamos la variable selectedSize para almacenar el tamaño seleccionado por el usuario
  const sizeHtml = (p.sizes ?? [])
    .map(size =>
      `<option value="${size}">
    ${size}</option>`)
    .join("");

  // Creamos las miniaturas usando todas las imágenes del producto.
  const thumbs = (p.images ?? [])
    .map(
      (img, index) => `
        <img 
          src="${img}" 
          class="img-thumbnail me-2 mb-2 product-thumb"
          data-index="${index}"
          style="width:70px;height:70px;object-fit:cover;cursor:pointer"
          alt="${escapeHtml(p.title)}">
      `
    )
    .join("");

  // Retornamos el HTML completo del producto.
  return `
    <div class="container my-4">
      <div class="row g-4">

        <!-- Columna izquierda: imágenes del producto -->
        <div class="col-md-6">

          <div class="position-relative">
            <!-- Imagen principal -->
            <img 
              id="mainProductImg" 
              src="${main}" 
              class="img-fluid w-100" 
              alt="${escapeHtml(p.title)}"
              style="max-height:600px;object-fit:cover;"
            >

            <!-- Flecha para imagen anterior -->
            <button 
              id="prevImgBtn"
              class="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-2"
              type="button">
              ❮
            </button>

            <!-- Flecha para imagen siguiente -->
            <button 
              id="nextImgBtn"
              class="btn btn-light position-absolute top-50 end-0 translate-middle-y me-2"
              type="button">
              ❯
            </button>
          </div>

          <!-- Miniaturas -->
          <div class="mt-3 d-flex flex-wrap">
            ${thumbs}
          </div>

        </div>

        <!-- Columna derecha: información del producto -->
        <div class="col-md-6">
          <h2 class="mb-2">${escapeHtml(p.title)}</h2>

          <p class="text-muted">
            ${escapeHtml(p.description)}
          </p>

          <div class="mb-3">
            <span class="fs-4 fw-semibold">
              ${moneyCRC(p.price)}
            </span>

            ${p.oldPrice
      ? `<span class="ms-2 text-muted text-decoration-line-through">
                    ${moneyCRC(p.oldPrice)}
                  </span>`
      : ""
    }
<!-- Agregamos el select para elegir talla -->
   <div class="mb-3">

  <label for="sizeSelect" class="form-label fw-semibold">
    Talla:
  </label>

  <select id="sizeSelect" class="form-select">

    <option value="">
      Seleccione una talla
    </option>

    ${sizeHtml}

  </select>

</div>
          </div>

          <!-- Botón para agregar al carrito sin salir de la página -->
          <button id="addToCartBtn" class="btn btn-outline-dark w-100 mb-2">
            AÑADIR AL CARRITO
          </button>

          <!-- Botón para agregar al carrito y pasar directo a cart.html -->
          <button id="buyNowBtn" class="btn btn-secondary w-100">
            COMPRAR AHORA
          </button>

          <!--Boton para volver al catalogo-->
          <a href="panties.html" class="btn btn-outline-dark w-100 mt-2">
            Volver al catálogo
          </a>

          <!-- Aquí aparece el mensaje de producto agregado -->
          <div id="cartMessage" class="mt-3"></div>
        </div>

      </div>
    </div>
  `;
}

// =====================================================
// FUNCIÓN: setupGallery
// Esta función maneja la galería de imágenes.
// Permite:
// - Cambiar imagen con flecha izquierda
// - Cambiar imagen con flecha derecha
// - Cambiar imagen al hacer clic en miniaturas
// Si solo hay una imagen, oculta las flechas.
// =====================================================
function setupGallery(images) {
  // Índice actual de la imagen que se está mostrando.
  let currentIndex = 0;

  // Buscamos los elementos de la galería.
  const mainImg = document.getElementById("mainProductImg");
  const prevBtn = document.getElementById("prevImgBtn");
  const nextBtn = document.getElementById("nextImgBtn");
  const thumbs = document.querySelectorAll(".product-thumb");

  // Si no existe imagen principal o no hay imágenes, detenemos la función.
  if (!mainImg || images.length === 0) return;

  // Función interna para mostrar una imagen según su índice.
  function showImage(index) {
    currentIndex = index;
    mainImg.src = images[currentIndex];
  }

  // Si el producto tiene solo una imagen, ocultamos las flechas.
  if (images.length <= 1) {
    if (prevBtn) prevBtn.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";
    return;
  }

  // Evento para la flecha izquierda.
  // Si está en la primera imagen, vuelve a la última.
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      let newIndex = currentIndex - 1;

      if (newIndex < 0) {
        newIndex = images.length - 1;
      }

      showImage(newIndex);
    });
  }

  // Evento para la flecha derecha.
  // Si está en la última imagen, vuelve a la primera.
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      let newIndex = currentIndex + 1;

      if (newIndex >= images.length) {
        newIndex = 0;
      }

      showImage(newIndex);
    });
  }

  // Evento para cada miniatura.
  // Al hacer clic en una miniatura, cambia la imagen principal.
  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const index = Number(thumb.dataset.index);
      showImage(index);
    });
  });
}

// =====================================================
// FUNCIÓN: addToCart
// Esta función agrega el producto al carrito.
// El carrito se guarda en localStorage.
// Si el producto ya existe, aumenta la cantidad.
// Si no existe, lo agrega con cantidad 1.
// =====================================================
function addToCart(product) {
  // Buscar el selector de talla y obtener el valor seleccionado
  const sizeSelect = document.getElementById("sizeSelect");
  // Obtener la talla seleccionada 
  const selectedSize = sizeSelect ? sizeSelect.value : "";
  // Si la persona no selecciono talla, mostramos un mensaje de error y no agregamos al carrito.
  if (!selectedSize) {
    const cartMessage = document.getElementById("cartMessage");
    if (cartMessage) {
      cartMessage.innerHTML = `
        <div class="alert alert-danger py-2">
          Por favor, seleccione una talla.
        </div>
      `;
    }
    return;
  }

  // Obtenemos el carrito guardado.
  // Si no existe, usamos un arreglo vacío.
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Buscamos si el producto ya está en el carrito.
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    // Si ya existe, aumentamos la cantidad.
    existingProduct.quantity += 1;
  } else {
    // Si no existe, agregamos el producto al carrito.
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      oldPrice: product.oldPrice,
      discount: product.discount,
      image: product.images?.[0] ?? "",
      size: selectedSize,
      quantity: 1
    });
  }

  // Guardamos el carrito actualizado en localStorage.
  localStorage.setItem("cart", JSON.stringify(cart));

  // Mostramos mensaje de confirmación.
  const cartMessage = document.getElementById("cartMessage");

  if (cartMessage) {
    cartMessage.innerHTML = `
      <div class="alert alert-success py-2">
        Producto agregado al carrito ✅
      </div>
    `;
  }

  // Mostramos el carrito en consola para revisar.
  console.log("Carrito actual:", cart);
}

// =====================================================
// FUNCIÓN: buyNow
// Esta función se activa al hacer clic en "COMPRAR AHORA".
// Primero agrega el producto al carrito.
// Luego envía a la persona a cart.html.
// =====================================================
function buyNow(product) {
  addToCart(product);
  window.location.href = "cart.html";
}

// =====================================================
// FUNCIÓN: escapeHtml
// Esta función evita errores si el texto tiene caracteres especiales.
// También ayuda a proteger el HTML cuando usamos datos del JSON.
// =====================================================
function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[m]));
}
