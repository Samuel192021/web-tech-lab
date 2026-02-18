let xmlDoc;
const table = document.getElementById("bookTable");

function loadBooks() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "books.xml", true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            xmlDoc = xhr.responseXML;
            if (!xmlDoc) return showToast("Malformed XML!", "red");
            renderBooks();
        } else {
            showToast("Failed to load XML", "red");
        }
    };

    xhr.onerror = () => showToast("Network Error", "red");
    xhr.send();
}

function renderBooks(filter = "") {
    table.innerHTML = "";
    const books = xmlDoc.getElementsByTagName("book");

    let total = 0, available = 0, borrowed = 0;

    for (let i = 0; i < books.length; i++) {
        const id = books[i].getElementsByTagName("id")[0].textContent;
        const title = books[i].getElementsByTagName("title")[0].textContent;
        const author = books[i].getElementsByTagName("author")[0].textContent;
        const status = books[i].getElementsByTagName("status")[0].textContent;

        if (!title.toLowerCase().includes(filter.toLowerCase())) continue;

        total++;
        if (status === "Available") available++;
        else borrowed++;

        table.innerHTML += `
        <tr>
            <td>${id}</td>
            <td>${title}</td>
            <td>${author}</td>
            <td>
                <span class="status-badge ${status === 'Available' ? 'badge-available' : 'badge-borrowed'}">
                    ${status}
                </span>
            </td>
            <td>
                <button onclick="toggleStatus(${i})">Toggle</button>
                <button onclick="deleteBook(${i})">Delete</button>
            </td>
        </tr>`;
    }

    document.getElementById("totalBooks").textContent = total;
    document.getElementById("availableBooks").textContent = available;
    document.getElementById("borrowedBooks").textContent = borrowed;
}

function toggleStatus(index) {
    const books = xmlDoc.getElementsByTagName("book");
    const statusNode = books[index].getElementsByTagName("status")[0];
    statusNode.textContent =
        statusNode.textContent === "Available" ? "Borrowed" : "Available";
    renderBooks();
    showToast("Status Updated", "green");
}

function deleteBook(index) {
    const books = xmlDoc.getElementsByTagName("book");
    books[index].parentNode.removeChild(books[index]);
    renderBooks();
    showToast("Book Deleted", "green");
}

document.getElementById("searchBox").addEventListener("input", function () {
    renderBooks(this.value);
});

function showToast(msg, color) {
    const toast = document.getElementById("toast");
    toast.style.display = "block";
    toast.style.background = color;
    toast.textContent = msg;
    setTimeout(() => toast.style.display = "none", 3000);
}

loadBooks();
