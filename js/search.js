const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

function normalizeText(text = "") {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

searchForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const searchTerm = normalizeText(searchInput.value.trim());

    if (searchTerm === "") {
        searchResults.innerHTML = "";
        searchResults.style.display = "none";
        return;
    }

    try {

        const response = await fetch("data/product.json");

        if (!response.ok) {
            throw new Error("No se pudo cargar product.json");
        }

        const products = await response.json();

        const results = products.filter(product => {

            const title = normalizeText(product.title);
            const description = normalizeText(product.description);
            const id = normalizeText(product.id);

            return (
                title.includes(searchTerm) ||
                description.includes(searchTerm) ||
                id.includes(searchTerm)
            );
        });

        showResults(results);

    } catch (error) {

        console.error("Error buscando productos:", error);

        searchResults.innerHTML = `
            <p class="search-message">
                Ocurrió un error al buscar.
            </p>
        `;

        searchResults.style.display = "block";
    }
});


function showResults(results) {

    searchResults.innerHTML = "";

    if (results.length === 0) {

        searchResults.innerHTML = `
            <p class="search-message">
                No encontramos productos.
            </p>
        `;

        searchResults.style.display = "block";
        return;
    }

    results.forEach(product => {

        const item = document.createElement("a");

        item.href = `product.html?id=${product.id}`;

        item.classList.add("search-result-item");

        item.innerHTML = `
            <img 
                src="${product.images?.[0] ?? ""}" 
                alt="${product.title}"
                class="search-result-img"
            >

            <div class="search-result-info">

                <span class="search-result-title">
                    ${product.title}
                </span>

                <span class="search-result-price">
                    ₡${Number(product.price).toLocaleString("es-CR")}
                </span>

            </div>
        `;

        searchResults.appendChild(item);
    });

    searchResults.style.display = "block";
}