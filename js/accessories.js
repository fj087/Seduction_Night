console.log("accesories.js cargó ✅");

const accessoriesGrid = document.getElementById("accessoriesGrid");

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

    // Mostramos solamente accesorios
    const accessories = products.filter(
      (product) =>
        product.category === "accesorios"
    );


    if (accessories.length === 0) {

      accessoriesGrid.innerHTML = `
        <div class="col-12">
          <div class="alert alert-info text-center">
            No hay accesorios disponibles en este momento.
          </div>
        </div>
      `;

      return;
    }


    accessoriesGrid.innerHTML = accessories
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
      "Error cargando accesorios:",
      error
    );


    accessoriesGrid.innerHTML = `
      <div class="col-12">

        <div class="alert alert-danger text-center">
          No se pudieron cargar los accesorios.
        </div>

      </div>
    `;

  });