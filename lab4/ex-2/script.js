const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");
const loader = document.getElementById("loader");

let debounceTimer;

searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        fetchProducts(searchInput.value.trim());
    }, 500); // Debounce delay 500ms
});

function fetchProducts(query) {
    loader.style.display = "block";
    results.innerHTML = "";

    fetch("products.json")
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch products");
            return response.json();
        })
        .then(data => {
            loader.style.display = "none";

            const filtered = data.products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );

            displayResults(filtered);
        })
        .catch(error => {
            loader.style.display = "none";
            results.innerHTML = `<div class="error">${error.message}</div>`;
        });
}

function displayResults(products) {
    if (products.length === 0) {
        results.innerHTML = `<div class="no-results">No results found</div>`;
        return;
    }

    products.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <div class="product-name">${product.name}</div>
            <div class="product-price">Price: ₹${product.price}</div>
            <div class="product-category">Category: ${product.category}</div>
        `;

        results.appendChild(card);
    });
}
