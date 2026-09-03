console.log("descuentos.js cargó ✅");

const descuentosGrid = document.getElementById("descuentosGrid");

const moneyCRC = (n) =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));


fetch("data/product.json")
  .then((response) => {

    if (!response.ok) {
      throw new Error(
        "No se pudo cargar data/product.json"
      );
    }

    return response.json();
  })

  .then((products) => {

    // Mostramos solamente descuento
    const descuento = products.filter(
      (product) =>
        product.category === "descuento"
    );


    if (descuento.length === 0) {

      descuentosGrid.innerHTML = `
        <div class="col-12">
          <div class="alert alert-info text-center">
            No hay descuentos disponibles en este momento.
          </div>
        </div>
      `;

      return;
    }


    descuentosGrid.innerHTML = descuento
      .map((product) => {

        const image =
          product.images?.[0] ?? "";


        return `
          <div class="col">

            <div class="card h-100">

              <a
                href="product.html?id=${product.id}"
                class="text-decoration-none text-dark"
              >

                <img
                  src="${image}"
                  class="card-img-top"
                  alt="${product.title}"
                  style="
                    height: 300px;
                    object-fit: cover;
                  "
                >

              </a>


              <div class="card-body text-center">

                <h5 class="card-title">
                  ${product.title}
                </h5>


                <div class="mb-2">

                  <span class="fw-semibold">
                    ${moneyCRC(product.price)}
                  </span>

                  ${
                    product.oldPrice
                      ? `
                        <span
                          class="text-muted
                                 text-decoration-line-through
                                 ms-2">
                          ${moneyCRC(product.oldPrice)}
                        </span>
                      `
                      : ""
                  }

                </div>


                ${
                  product.discount
                    ? `
                      <span class="badge bg-danger mb-3">
                        -${product.discount}%
                      </span>
                    `
                    : ""
                }


                <div>

                  <a
                    href="product.html?id=${product.id}"
                    class="btn btn-outline-dark w-100"
                  >
                    VER PRODUCTO
                  </a>

                </div>

              </div>

            </div>

          </div>
        `;
      })
      .join("");

  })

  .catch((error) => {

    console.error(
      "Error cargando descuentos:",
      error
    );


    descuentosGrid.innerHTML = `
      <div class="col-12">

        <div class="alert alert-danger text-center">
          No se pudieron cargar los descuentos.
        </div>

      </div>
    `;

  });