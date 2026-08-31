// Mensaje para confirmar en la consola que cart.js sí cargó
console.log("cart.js cargó ✅");

// Buscamos el contenedor del HTML donde se van a mostrar los productos del carrito
// En cart.html debe existir: <div id="cartRoot"></div>
const cartRoot = document.getElementById("cartRoot");

// Función para dar formato de moneda en colones costarricenses
const moneyCRC = (n) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

// Llamamos la función principal para mostrar el carrito apenas cargue la página
renderCart();

// Esta función obtiene el carrito guardado en localStorage
// Si no hay carrito guardado, devuelve un arreglo vacío []
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Esta función guarda nuevamente el carrito en localStorage
// Se usa cuando cambiamos cantidades, eliminamos o vaciamos el carrito
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Esta función muestra los productos del carrito en pantalla
function renderCart() {
  // Obtenemos los productos guardados en el carrito
  const cart = getCart();

  // Si el carrito está vacío, mostramos un mensaje
  if (cart.length === 0) {
    cartRoot.innerHTML = `
      <div class="alert alert-info text-center">
        Tu carrito está vacío.
      </div>

      <div class="text-center">
        <a href="panties.html" class="btn btn-dark">
          Seguir comprando
        </a>
      </div>
    `;
    return;
  }

  // Variable para acumular el total de la compra
  let total = 0;

  // Recorremos cada producto del carrito y creamos su HTML
  const itemsHTML = cart.map((item) => {
    // Calculamos subtotal: precio x cantidad
    const subtotal = item.price * item.quantity;

    // Sumamos cada subtotal al total general
    total += subtotal;

    // Retornamos la card HTML de cada producto
    return `
      <div class="card mb-3">
        <div class="row g-0 align-items-center">

          <!-- Imagen del producto -->
          <div class="col-4 col-md-2">
            <img 
              src="${item.image}" 
              class="img-fluid rounded-start" 
              alt="${item.title}"
              style="height:120px; width:100%; object-fit:cover;"
            >
          </div>

          <!-- Información del producto -->
          <div class="col-8 col-md-10">
            <div class="card-body">

              <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div>
                  <h5 class="card-title mb-1">${item.title}</h5>

                  <p class="card-text mb-1">
                    Precio: ${moneyCRC(item.price)}
                  </p>
                  
                  <p class="card-text mb-1">
                  Talla: <strong>${item.size || "No especificada"}</strong>

                  <p class="card-text mb-1">
                    Subtotal: <strong>${moneyCRC(subtotal)}</strong>
                  </p>
                </div>

                <!-- Botón para eliminar este producto del carrito -->
                <button 
                  class="btn btn-sm btn-outline-danger"
                  onclick="removeFromCart('${item.id}')">
                  Eliminar
                </button>
              </div>

              <!-- Botones para aumentar o disminuir cantidad -->
              <div class="d-flex align-items-center gap-2 mt-3">
                <button 
                  class="btn btn-sm btn-outline-dark"
                  onclick="decreaseQuantity('${item.id}')">
                  -
                </button>

                <span class="px-2">
                  ${item.quantity}
                </span>

                <button 
                  class="btn btn-sm btn-outline-dark"
                  onclick="increaseQuantity('${item.id}')">
                  +
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    `;
  }).join("");

  // Pintamos todos los productos y el resumen del total en cartRoot
  cartRoot.innerHTML = `
    ${itemsHTML}

    <div class="card p-3 mt-4">
      <div class="d-flex justify-content-between align-items-center">
        <h4>Total:</h4>
        <h4>${moneyCRC(total)}</h4>
      </div>

      <button 
      class= "btn btn-success w-100 mt-3"
      onclick="finalizarCompraWhatsapp()">
      <i class="fa-brands fa-whatsapp"></i> 
      Finalizar compra por WhatsApp
      </button>

      <button class="btn btn-outline-dark w-100 mt-2" onclick ="contuinarComprando()">
        CONTINUAR COMPRANDO
      </button>
      <button class="btn btn-outline-danger w-100 mt-2" onclick="clearCart()">
        Vaciar carrito
      </button>
    </div>
  `;
}

// Función para aumentar la cantidad de un producto
function increaseQuantity(id) {
  const cart = getCart();

  // Buscamos el producto por su id
  const product = cart.find((item) => item.id === id);

  // Si existe, aumentamos la cantidad
  if (product) {
    product.quantity += 1;
  }

  // Guardamos el carrito actualizado
  saveCart(cart);

  // Volvemos a pintar el carrito en pantalla
  renderCart();
}

// Función para disminuir la cantidad de un producto
function decreaseQuantity(id) {
  let cart = getCart();

  // Buscamos el producto por su id
  const product = cart.find((item) => item.id === id);

  if (product) {
    // Disminuimos la cantidad
    product.quantity -= 1;

    // Si la cantidad llega a 0, eliminamos el producto del carrito
    if (product.quantity <= 0) {
      cart = cart.filter((item) => item.id !== id);
    }
  }

  // Guardamos el carrito actualizado
  saveCart(cart);

  // Volvemos a pintar el carrito
  renderCart();
}

// Función para eliminar completamente un producto del carrito
function removeFromCart(id) {
  // Creamos un nuevo carrito dejando fuera el producto que queremos eliminar
  const cart = getCart().filter((item) => item.id !== id);

  // Guardamos el carrito actualizado
  saveCart(cart);

  // Volvemos a pintar el carrito
  renderCart();
}

// Función para vaciar todo el carrito
function clearCart() {
  // Eliminamos el carrito completo del localStorage
  localStorage.removeItem("cart");

  // Volvemos a pintar la pantalla, ahora con el mensaje de carrito vacío
  renderCart();

}
// Función para continuar comprando, redirigiendo a la página principal
function contuinarComprando() {
  window.location.href = "panties.html";
}

//============================================================================
// FINALIZAR COMPRA POR WHATSAPP
//============================================================================

function finalizarCompraWhatsapp() {

  const cart = getCart();

  // Verificamos que haya productos en el carrito
  if (cart.length === 0) {
    alert("Tu carrito está vacío. Agrega productos antes de finalizar la compra.");
    return;
  }

  // Número de WhatsApp de Seduction Night
  // Costa Rica = 506
  const phoneNumber = "50672714390";

  // Variable para calcular el total
  let total = 0;

  // Encabezado del mensaje
  let message = "Hola, quiero realizar este pedido en Seduction Night 💕\n\n";

  message += "🛍️ *Mi pedido:*\n\n";

  // Recorremos los productos
  cart.forEach((item, index) => {

    const subtotal = item.price * item.quantity;

    total += subtotal;

    message += `${index + 1}. *${item.title}*\n`;

    message += `Talla: ${item.size || "No especificada"}\n`;

    message += `Cantidad: ${item.quantity}\n`;

    message += `Precio: ${moneyCRC(item.price)}\n`;

    message += `Subtotal: ${moneyCRC(subtotal)}\n\n`;
  });

  // Total
  message += `💰 *Total: ${moneyCRC(total)}*\n\n`;

  message += "¿Me pueden ayudar a confirmar disponibilidad y entrega?";

  // Convertimos el mensaje para WhatsApp
  const encodedMessage = encodeURIComponent(message);

  // Creamos enlace
  const whatsappURL =
    `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  // Abrimos WhatsApp
  window.open(whatsappURL, "_blank");
}