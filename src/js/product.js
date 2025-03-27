// Store products in localStorage
let products = JSON.parse(localStorage.getItem("products")) || [];

// DOM Elements
const productForm = document.querySelector(".formProduct");
const productTable = document.querySelector(".productTable tbody");

// Load products on page load
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  updateDashboardStats();
});

// Create Product
productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const productName = productForm.querySelector(
    'input[placeholder="Enter product name"]'
  ).value;
  const price = productForm.querySelector(
    'input[placeholder="Enter product price"]'
  ).value;
  const quantity = productForm.querySelector(
    'input[placeholder="Enter product quantity"]'
  ).value;
  const category = productForm.querySelector("select").value;
  const description = productForm.querySelector("textarea").value;

  if (!productName || !price || !quantity || !category) {
    alert("Please fill in all required fields");
    return;
  }

  // Check if we're updating or creating
  const editId = productForm.dataset.editId;

  if (editId) {
    // Update existing product
    const index = products.findIndex((p) => p.id === parseInt(editId));
    if (index !== -1) {
      products[index] = {
        ...products[index],
        productName,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        category,
        description,
      };
    }
    // Reset form state
    delete productForm.dataset.editId;
    productForm.querySelector('button[type="submit"]').textContent =
      "Add Product";
    productForm
      .querySelector('button[type="submit"]')
      .classList.replace("btn-primary", "btn-success");
  } else {
    // Create new product
    const newId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const product = {
      id: newId,
      productName,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category,
      description,
    };
    products.push(product);
  }

  saveProducts();
  loadProducts();
  updateDashboardStats();
  productForm.reset();
});

// Read Products (Load products to table)
function loadProducts() {
  productTable.innerHTML = "";

  // Sort products by ID to ensure sequential order
  products.sort((a, b) => a.id - b.id);

  products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.productName}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-btn" data-id="${
                  product.id
                }">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${
                  product.id
                }">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    productTable.appendChild(row);
  });

  // Add event listeners to edit and delete buttons
  attachButtonListeners();
}

// Update Product
function editProduct(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  // Populate form with product data
  productForm.querySelector('input[placeholder="Enter product name"]').value =
    product.productName;
  productForm.querySelector('input[placeholder="Enter product price"]').value =
    product.price;
  productForm.querySelector(
    'input[placeholder="Enter product quantity"]'
  ).value = product.quantity;
  productForm.querySelector("select").value = product.category;
  productForm.querySelector("textarea").value = product.description;

  // Change form submit button to update
  const submitBtn = productForm.querySelector('button[type="submit"]');
  submitBtn.textContent = "Update Product";
  submitBtn.classList.replace("btn-success", "btn-primary");

  // Add data attribute to form for update operation
  productForm.dataset.editId = id;
}

// Delete Product
function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    // Remove the product
    products = products.filter((p) => p.id !== id);

    // Reorder IDs
    products = products.map((product, index) => ({
      ...product,
      id: index + 1,
    }));

    saveProducts();
    loadProducts();
    updateDashboardStats();
  }
}

// Helper Functions
function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

function attachButtonListeners() {
  // Edit button listeners
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      editProduct(parseInt(btn.dataset.id));
    });
  });

  // Delete button listeners
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      deleteProduct(parseInt(btn.dataset.id));
    });
  });
}

// Update Dashboard Statistics
function updateDashboardStats() {
  // Update products count
  const productsCount = document.querySelector(".card:nth-child(1) h4");
  if (productsCount) {
    productsCount.textContent = products.length;
  }

  // Calculate and update products growth (simplified)
  const growthElement = document.querySelector(
    ".card:nth-child(1) .text-success"
  );
  if (growthElement) {
    const growth = products.length > 0 ? "▲ 4.87%" : "0%";
    growthElement.textContent = growth;
  }

  // Update categories count (unique categories)
  const uniqueCategories = [...new Set(products.map((p) => p.category))];
  const categoriesCount = document.querySelector(".card:nth-child(2) h4");
  if (categoriesCount) {
    categoriesCount.textContent = uniqueCategories.length;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    createAuthOverlay();
  } else {
    // Check if session has expired (if user wasn't "remembered")
    if (!user.isRemembered) {
      const lastActivity = new Date(user.timestamp);
      const now = new Date();
      const hoursSinceLogin = (now - lastActivity) / (1000 * 60 * 60);

      // Auto logout after 24 hours
      if (hoursSinceLogin > 24) {
        localStorage.removeItem("user");
        createAuthOverlay();
        return;
      }
    }

    // Update timestamp for session management
    user.timestamp = new Date().toISOString();
    localStorage.setItem("user", JSON.stringify(user));
  }
});

function createAuthOverlay() {
  // Create blur overlay
  const blurOverlay = document.createElement("div");
  Object.assign(blurOverlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(5px)",
    zIndex: "9998",
  });
  document.body.appendChild(blurOverlay);

  // Create modal
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    zIndex: "9999",
  });

  // Modal content
  modal.innerHTML = `
        <h2>Authentication Required</h2>
        <p>Please log in to access this page</p>
        <button id="loginBtn" style="padding: 10px 20px; margin-top: 10px; cursor: pointer; border: none; background: #103cbe; color: white; border-radius: 5px;">Login</button>
    `;

  document.body.appendChild(modal);

  // Add event listener to login button
  document.getElementById("loginBtn").addEventListener("click", function () {
    window.location.href = "/views/authentication.html";
  });
}
