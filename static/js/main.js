// Run this when the page loads
document.addEventListener("DOMContentLoaded", () => {
    loadItems();

    // Handle add form submission
    document.getElementById("add-form").addEventListener("submit", (e) => {
        e.preventDefault();
        addItem();
    });

    // Handle edit form submission
    document.getElementById("edit-form").addEventListener("submit", (e) => {
        e.preventDefault();
        updateItem();
    });
});

// Load all items and display them
function loadItems() {
    fetch("/items")
        .then(res => res.json())
        .then(data => {
            const inventory = document.getElementById("inventory");
            inventory.innerHTML = "";

            data.forEach(item => {
                const card = document.createElement("div");
                card.className = "cloth-card";

                card.innerHTML = `
                    <img src="${item.image || '/static/Images/default.jpg'}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p><strong>₦${item.price.toFixed(2)}</strong></p>
                    <button onclick="showEditModal(${item.id}, '${escapeQuotes(item.name)}', '${escapeQuotes(item.description)}', ${item.price}, '${escapeQuotes(item.image)}')">Edit</button>
                    <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
                `;

                inventory.appendChild(card);
            });
        });
}

// Add new item
function addItem() {
    const name = document.getElementById("name").value.trim();
    const description = document.getElementById("description").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const image = document.getElementById("image").value.trim();

    if (!name || isNaN(price)) {
        alert("Please enter valid name and price.");
        return;
    }

    fetch("/add", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price, image })
    })
    .then(res => res.json())
    .then(() => {
        document.getElementById("add-form").reset();
        loadItems();
    });
}

// Delete item
function deleteItem(id) {
    if (!confirm("Are you sure you want to delete this item?")) return;

    fetch(`/delete/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(() => {
        loadItems();
    });
}

// Show modal to edit item
function showEditModal(id, name, description, price, image) {
    document.getElementById("edit-id").value = id;
    document.getElementById("edit-name").value = name;
    document.getElementById("edit-description").value = description;
    document.getElementById("edit-price").value = price;
    document.getElementById("edit-image").value = image;

    document.getElementById("edit-modal").classList.add("show");
}

// Update existing item
function updateItem() {
    const id = document.getElementById("edit-id").value;
    const name = document.getElementById("edit-name").value.trim();
    const description = document.getElementById("edit-description").value.trim();
    const price = parseFloat(document.getElementById("edit-price").value);
    const image = document.getElementById("edit-image").value.trim();

    if (!name || isNaN(price)) {
        alert("Please enter valid name and price.");
        return;
    }

    fetch(`/edit/${id}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price, image })
    })
    .then(res => res.json())
    .then(() => {
        closeModal();
        loadItems();
    });
}

// Hide modal
function closeModal() {
    document.getElementById("edit-modal").classList.remove("show");
}

// Utility: Escape quotes to prevent HTML breaking
function escapeQuotes(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, "&quot;");
}

// Optional: Close modal when clicking outside
window.addEventListener("click", (e) => {
    const modal = document.getElementById("edit-modal");
    if (e.target === modal) {
        closeModal();
    }
});
