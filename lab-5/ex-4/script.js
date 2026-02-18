let products = [];

async function loadProducts() {
    try {
        const response = await fetch("inventory.json");
        if (!response.ok)
            throw new Error("Failed to load JSON (Status " + response.status + ")");

        const data = await response.json();
        products = data.products || [];
        renderProducts();
    } catch (error) {
        showToast("JSON Error: " + error.message, "red");
    }
}

function renderProducts(filter = "") {
    const table = document.getElementById("inventoryTable");
    table.innerHTML = "";

    let totalValue = 0;
    let lowStockCount = 0;

    const filtered = products.filter(p =>
        p.category.toLowerCase().includes(filter.toLowerCase())
    );

    filtered.forEach((product, index) => {
        const value = product.price * product.stock;
        totalValue += value;

        const isLowStock = product.stock <= 5;
        if (isLowStock) lowStockCount++;

        table.innerHTML += `
        <tr class="${isLowStock ? 'low-stock-row' : ''}">
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₹${product.price}</td>
            <td>${product.stock}</td>
            <td>₹${value}</td>
            <td>
                <button onclick="editProduct(${index})">Edit</button>
                <button onclick="deleteProduct(${index})">Delete</button>
            </td>
        </tr>`;
    });

    document.getElementById("totalProducts").textContent = filtered.length;
    document.getElementById("totalValue").textContent = "₹" + totalValue;
    document.getElementById("lowStockCount").textContent = lowStockCount;
}

document.getElementById("productForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const id = productId.value.trim();
    const nameVal = name.value.trim();
    const categoryVal = category.value.trim();
    const priceVal = parseFloat(price.value);
    const stockVal = parseInt(stock.value);

    if (!id || !nameVal || !categoryVal || isNaN(priceVal) || isNaN(stockVal)) {
        showToast("Invalid input data!", "red");
        return;
    }

    products.push({
        id,
        name: nameVal,
        category: categoryVal,
        price: priceVal,
        stock: stockVal
    });

    renderProducts();
    this.reset();
    showToast("Product Added!", "green");
});

function editProduct(index) {
    const newPrice = prompt("Enter new price:");
    const newStock = prompt("Enter new stock quantity:");

    if (!isNaN(newPrice)) products[index].price = parseFloat(newPrice);
    if (!isNaN(newStock)) products[index].stock = parseInt(newStock);

    renderProducts();
    showToast("Product Updated!", "green");
}

function deleteProduct(index) {
    products.splice(index, 1);
    renderProducts();
    showToast("Product Deleted!", "green");
}

document.getElementById("categorySearch").addEventListener("input", function() {
    renderProducts(this.value);
});

function showToast(msg, color) {
    const toast = document.getElementById("toast");
    toast.style.display = "block";
    toast.style.background = color;
    toast.textContent = msg;
    setTimeout(() => toast.style.display = "none", 3000);
}

loadProducts();
