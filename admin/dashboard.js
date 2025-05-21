import {
  loginUser,
  validateName,
  validatePhone,
  validateEmail,
} from "/assets/js/utils.js";
const user = loginUser();
if (user?.role !== "Admin" || !user) {
  window.location.href = "/customer/home/home.html";
}
// DOM Elements
const elements = {
  sidebar: {
    container: document.getElementById("sidebarContainer"),
    sidebar: document.getElementById("sidebar"),
    openBtn: document.getElementById("openSidebar"),
    closeBtn: document.getElementById("closeSidebar"),
  },
  mainContent: document.getElementById("mainContent"),
  userDisplay: {
    name: document.getElementById("userName"),
    revenue: document.querySelector(".TotalRevenue"),
    revenueRate: document.querySelector(".TotalRevenueRate"),
    inStock: document.querySelector(".inStock"),
    orders: document.querySelector(".totalOrders"),
    products: document.querySelector(".topSellingProducts"),
    totalProductsNum: document.querySelector(".totalProductsNum"),
    users: document.querySelector(".totalUsers"),
    flashTable: document.querySelector("table > tbody"),
    allProducts: document.querySelector(".allProducts"),
  },
};

// Data
let users = JSON.parse(localStorage.getItem("users")) || [];
const sellers = users.filter((u) => u.role === "Seller");
let allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];

// Initialize
function init() {
  setupSidebar();
  setupSectionToggles();
  renderDashboard();
  setupCharts();
  startFlashSaleTimer();
  renderUserSection();
  renderProductSection();
}

// Sidebar Functions
function setupSidebar() {
  const { container, openBtn, closeBtn } = elements.sidebar;

  // Initial state
  if (container.classList.contains("collapsed")) {
    openBtn.style.display = "block";
    closeBtn.style.display = "none";
    elements.mainContent.classList.add("full");
  } else {
    openBtn.style.display = "none";
    closeBtn.style.display = "block";
    elements.mainContent.classList.remove("full");
  }

  // Event listeners
  elements.sidebar.openBtn.addEventListener("click", () =>
    toggleSidebar(false)
  );
  elements.sidebar.closeBtn.addEventListener("click", () =>
    toggleSidebar(true)
  );
}

function toggleSidebar(collapse) {
  const { container, openBtn, closeBtn } = elements.sidebar;

  container.classList.toggle("collapsed", collapse);
  elements.mainContent.classList.toggle("full", collapse);
  openBtn.style.display = collapse ? "block" : "none";
  closeBtn.style.display = collapse ? "none" : "block";
}

// Section Navigation
function setupSectionToggles() {
  document.querySelectorAll(".section-toggle-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetId = this.getAttribute("data-show");
      for (let btn of document.querySelectorAll(".section-toggle-btn")) {
        btn.classList.remove("active");
      }
      this.classList.add("active");
      // Hide all sections
      Array.from(elements.mainContent.children).forEach((child) => {
        child.classList.add("d-none");
        child.classList.remove("active");
      });

      // Show target section
      document.getElementById(targetId)?.classList.remove("d-none");
    });
  });
}

// Dashboard Rendering
function renderDashboard() {
  const user = loginUser();
  elements.userDisplay.name.textContent = `${user?.firstName} ${user?.lastName}`;

  // Calculate revenue and orders
  let sum = 0;
  let allOrders = 0;

  users.forEach((user) => {
    user?.orders?.forEach((order) => {
      allOrders++;
      sum += Number(order.total) || 0;
    });
  });

  elements.userDisplay.revenue.textContent = `$${sum.toFixed(2)}`;
  elements.userDisplay.orders.textContent = allOrders;

  // Revenue percentage calculation
  const lastDayRevenue =
    parseFloat(localStorage.getItem("totalRevenuePrevDay")) || 0;
  let percentDifference = 0;

  if (lastDayRevenue) {
    percentDifference =
      lastDayRevenue === 0
        ? 0
        : ((sum - lastDayRevenue) / lastDayRevenue) * 100;
    if (Math.abs(percentDifference) < 0.001) percentDifference = 0;
  }

  elements.userDisplay.revenueRate.classList.add(
    percentDifference >= 0 ? "text-success" : "text-danger"
  );

  elements.userDisplay.revenueRate.innerHTML =
    percentDifference >= 0
      ? `<i class="fas fa-arrow-up" aria-hidden="true"></i> ${Math.abs(
          percentDifference
        ).toFixed(2)}% from last day`
      : `<i class="fas fa-arrow-down" aria-hidden="true"></i> ${Math.abs(
          percentDifference
        ).toFixed(2)}% from last day`;

  // Stock information
  const productsInStock = allProducts.filter((p) => p.quantity > 0).length;
  elements.userDisplay.totalProductsNum.textContent = allProducts.length;
  const lowStockCount = allProducts.length - productsInStock;

  if (lowStockCount > 0) {
    elements.userDisplay.inStock.classList.remove("d-none");
    elements.userDisplay.inStock.innerHTML = `<i class="fas fa-arrow-down" aria-hidden="true"></i> ${lowStockCount} items low stock`;
  } else {
    elements.userDisplay.inStock.classList.add("d-none");
  }

  // Total users
  const totalUsersCount = users?.length > 0 ? users?.length - 1 : 0;
  elements.userDisplay.users.textContent = totalUsersCount;

  // Top selling products
  renderTopSellingProducts();
  renderFlashSaleProducts();
}

// Product Rendering
function renderTopSellingProducts() {
  const productCounts = {};

  users?.forEach((user) => {
    user?.orders?.forEach((order) => {
      order.products?.forEach((product) => {
        if (!productCounts[product.id]) {
          productCounts[product.id] = { ...product, count: 0 };
        }
        productCounts[product.id].count += product.count || 0;
      });
    });
  });

  const topProducts = Object.values(productCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  elements.userDisplay.products.innerHTML = topProducts
    .map(
      (product) => `
    <div class="col-sm-6 col-md-6 col-lg-6 mb-3">
      <div class="card product-card h-100">
        <img src="${
          product.image
        }" class="card-img-top w-50" alt="Product" loading ="lazy"/>
        ${
          product.sale.trim()
            ? `<span class="discount-badge">${product.sale} OFF</span>`
            : ""
        }
        <div class="card-body">
          <h6 class="card-title">${product.name}</h6>
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-danger"> $${
                product.sale.trim()
                  ? parseFloat(product.price) *
                    (1 - parseFloat(product.sale) / 100)
                  : product.price
              }</span>
              ${
                product.sale.trim()
                  ? `
                <span class="text-muted text-decoration-line-through ms-2">
                  $${product.price}
                </span>
              `
                  : ""
              }
            </div>
            <span class="text-muted small">${product.count} sold</span>
          </div>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

function renderFlashSaleProducts() {
  const productCounts = {};

  users?.forEach((user) => {
    user?.orders?.forEach((order) => {
      order.products?.forEach((product) => {
        if (!productCounts[product.id]) {
          productCounts[product.id] = product.count || 0;
        } else {
          productCounts[product.id] += product.count || 0;
        }
      });
    });
  });

  const flashProducts = allProducts
    .filter((p) => p.sale)
    .sort((a, b) => parseFloat(b.sale) - parseFloat(a.sale));

  elements.userDisplay.flashTable.innerHTML = flashProducts
    .map(
      (product) => `
    <tr>
      <td>${product.name}</td>
      <td>
        <span class="badge ${
          parseFloat(product.sale) > 15
            ? "bg-danger bg-opacity-10 text-danger"
            : "bg-success bg-opacity-10 text-success"
        }">
          ${product.sale}
        </span>
      </td>
      <td>${productCounts[product.id] || 0}</td>
      <td>$${product.price}</td>
    </tr>
  `
    )
    .join("");
}

// Charts
function setupCharts() {
  // Category Chart
  const categoryCtx = document.getElementById("categoryChart").getContext("2d");
  new Chart(categoryCtx, {
    type: "doughnut",
    data: {
      labels: [
        "Men & Fashion",
        "Electronics",
        "Home & Lifestyle",
        "Medicine",
        "Sports & Outdoor",
      ],
      datasets: [
        {
          data: [0, 100, 0, 0, 0],
          backgroundColor: [
            "#3498db",
            "#2ecc71",
            "#9b59b6",
            "#f1c40f",
            "#e74c3c",
          ],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "right" },
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${context.raw}%`,
          },
        },
      },
    },
  });

  // Sales Chart
  const dailySales = Array(7).fill(0);

  users?.forEach((user) => {
    user?.orders?.forEach((order) => {
      const day = new Date(order.date).getDay();
      dailySales[day > 6 ? 0 : day] += Number(order.total) || 0;
    });
  });

  const salesCtx = document.getElementById("salesChart").getContext("2d");
  new Chart(salesCtx, {
    type: "line",
    data: {
      labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      datasets: [
        {
          label: "Sales",
          data: dailySales,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        tooltip: { mode: "index", intersect: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `$${value}`,
          },
        },
      },
    },
  });
}

// Flash Sale Timer
function startFlashSaleTimer() {
  const timerElements = {
    hours: document.getElementById("flashSaleHours"),
    minutes: document.getElementById("flashSaleMinutes"),
    seconds: document.getElementById("flashSaleSeconds"),
  };

  let time = {
    h: parseInt(timerElements.hours.textContent),
    m: parseInt(timerElements.minutes.textContent),
    s: parseInt(timerElements.seconds.textContent),
  };

  setInterval(() => {
    time.s--;
    if (time.s < 0) {
      time.s = 59;
      time.m--;
      if (time.m < 0) {
        time.m = 59;
        time.h--;
      }
    }

    timerElements.hours.textContent = time.h.toString().padStart(2, "0");
    timerElements.minutes.textContent = time.m.toString().padStart(2, "0");
    timerElements.seconds.textContent = time.s.toString().padStart(2, "0");
  }, 1000);
}

// User Management
function renderUserSection() {
  const usersAccordion = document.getElementById("usersAccordion");
  usersAccordion.innerHTML = "";

  // Skip first user (admin)
  users?.slice(1).forEach((user) => {
    const userId = user?.userId;
    const userRoleClass =
      user?.role === "Seller" ? "role-seller" : "role-customer";

    usersAccordion.innerHTML += `
      <div class="accordion-item mb-2">
        <h2 class="accordion-header" id="heading-${userId}">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" 
            data-bs-target="#collapse-${userId}" aria-expanded="false" aria-controls="collapse-${userId}">
            ${user?.firstName} ${user?.lastName}
            <span class="user-role ${userRoleClass}">${user?.role}</span>
          </button>
        </h2>
        <div id="collapse-${userId}" class="accordion-collapse collapse" 
          aria-labelledby="heading-${userId}" data-bs-parent="#usersAccordion">
          <div class="accordion-body">
            <div class="user-info-item">
              <span class="user-info-label">First Name:</span> ${
                user?.firstName
              }
            </div>
            <div class="user-info-item">
              <span class="user-info-label">Last Name:</span> ${user?.lastName}
            </div>
            <div class="user-info-item">
              <span class="user-info-label">Email:</span> ${user?.email}
            </div>
            <div class="user-info-item">
              <span class="user-info-label">Phone:</span> ${user?.phone}
            </div>
            <div class="user-info-item">
              <span class="user-info-label">Role:</span> ${user?.role}
            </div>
            <div class="mt-3">
              <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal-${userId}">
                <i class="fas fa-edit me-1" aria-hidden="true"></i> Edit
              </button>
              <button class="btn btn-danger ms-2" onclick="window.deleteUser(${userId})">
                <i class="fas fa-trash-alt me-1" aria-hidden="true"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- User Modal -->
      <div class="modal fade" id="modal-${userId}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit User</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form onsubmit="window.saveUserChanges(${userId}); return false;">
                <div class="mb-3">
                  <label class="form-label">First Name</label>
                  <input type="text" class="form-control" id="modal-${userId}-firstName" 
                    value="${user?.firstName}" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Last Name</label>
                  <input type="text" class="form-control" id="modal-${userId}-lastName" 
                    value="${user?.lastName}" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" id="modal-${userId}-email" 
                    value="${user?.email}" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Phone</label>
                  <input type="tel" class="form-control" id="modal-${userId}-phone" 
                    value="${user?.phone}" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Role</label>
                  <select class="form-select" id="modal-${userId}-role" required>
                    <option value="Customer" ${
                      user?.role === "Customer" ? "selected" : ""
                    }>Customer</option>
                    <option value="Seller" ${
                      user?.role === "Seller" ? "selected" : ""
                    }>Seller</option>
                  </select>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button type="submit" class="btn btn-primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  // Seller Applications
  renderSellerApplications();
}

function renderSellerApplications() {
  const applicationsContainer = document.querySelector(".applications");
  const pendingBadge = document.querySelector(".pending");
  const noPendingMessage = document.querySelector(".noPending");

  const wantedSellers = users?.filter((user) => user?.want_to_be_seller);
  pendingBadge.textContent = `${wantedSellers.length} pending`;

  if (wantedSellers.length === 0) {
    noPendingMessage.classList.remove("d-none");
    applicationsContainer.innerHTML = "";
    return;
  }

  noPendingMessage.classList.add("d-none");
  applicationsContainer.innerHTML = wantedSellers
    .map(
      (user) => `
    <div class="request-item">
      <div class="request-username">${user?.firstName} ${user?.lastName}</div>
      <div class="request-email">${user?.email}</div>
      <div class="mt-2">
        <button class="btn btn-success btn-accept" onclick="window.approveSeller(${user?.userId})">
          <i class="fas fa-check me-1" aria-hidden="true"></i> Approve
        </button>
        <button class="btn btn-danger btn-reject" onclick="window.rejectSeller(${user?.userId})">
          <i class="fas fa-times me-1" aria-hidden="true"></i> Reject
        </button>
      </div>
    </div>
  `
    )
    .join("");
}

// Window functions
window.saveUserChanges = async function (userId) {
  try {
    const modal = bootstrap.Modal.getInstance(
      document.getElementById(`modal-${userId}`)
    );
    const inputs = {
      firstName: document
        .getElementById(`modal-${userId}-firstName`)
        .value.trim(),
      lastName: document
        .getElementById(`modal-${userId}-lastName`)
        .value.trim(),
      email: document.getElementById(`modal-${userId}-email`).value.trim(),
      phone: document.getElementById(`modal-${userId}-phone`).value.trim(),
      role: document.getElementById(`modal-${userId}-role`).value,
    };

    // Validation
    if (!validateName(inputs?.firstName) || !validateName(inputs.lastName)) {
      throw new Error("Please enter valid names");
    }
    if (!validateEmail(inputs?.email)) {
      throw new Error("Please enter a valid email");
    }
    if (!validatePhone(inputs?.phone)) {
      throw new Error("Please enter a valid phone number");
    }

    // Update user
    const userIndex = users?.findIndex((u) => u.userId === userId);
    if (userIndex === -1) throw new Error("User not found");

    users[userIndex] = { ...users[userIndex], ...inputs };
    localStorage.setItem("users", JSON.stringify(users));

    await Swal.fire("Success!", "User updated successfully", "success");
    modal.hide();
    renderUserSection();
  } catch (error) {
    await Swal.fire("Error!", error.message, "error");
  }
};

window.deleteUser = async function (userId) {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });

  if (!result.isConfirmed) return;
  const user = users?.find((u) => u.userId === userId);
  users = users?.filter((u) => u.userId !== userId);
  localStorage.setItem("users", JSON.stringify(users));
  allProducts = allProducts?.filter((p) => p?.seller !== user.firstName);
  localStorage.setItem("allProducts", JSON.stringify(allProducts));
  await Swal?.fire("Deleted!", "User has been deleted.", "success");
  renderUserSection();
  renderProductSection();
};

window.approveSeller = async function (userId) {
  const userIndex = users?.findIndex((u) => u.userId === userId);
  if (userIndex === -1) return;

  users[userIndex] = {
    ...users[userIndex],
    role: "Seller",
    want_to_be_seller: false,
  };

  localStorage.setItem("users", JSON.stringify(users));
  await Swal?.fire("Approved!", "User is now a seller.", "success");
  renderSellerApplications();
  renderUserSection();
};

window.rejectSeller = async function (userId) {
  const userIndex = users.findIndex((u) => u.userId === userId);
  if (userIndex === -1) return;

  users[userIndex] = {
    ...users[userIndex],
    want_to_be_seller: false,
  };

  localStorage.setItem("users", JSON.stringify(users));
  await Swal?.fire("Rejected!", "Seller request rejected.", "success");
  renderSellerApplications();
};

function renderProductSection() {
  const totalProductsHeader = document.querySelector(".totalProductsHeader");
  totalProductsHeader.innerHTML = ` (${allProducts.length})`;
  elements.userDisplay.allProducts.innerHTML = "";

  allProducts.forEach((product) => {
    const carouselIndicators = product.images
      .map(
        (_, index) => `
        <button type="button" data-bs-target="#carousel-${product.id}" 
                data-bs-slide-to="${index}" 
                ${index === 0 ? 'class="active" aria-current="true"' : ""}
                aria-label="Slide ${index + 1}"></button>
      `
      )
      .join("");

    const carouselItems = product.images
      .map(
        (image, index) => `
        <div class="carousel-item ${index === 0 ? "active" : ""}">
          <img src="${image}" 
               class="d-block product-img" 
               style="width: 250px; height: 200px; object-fit: contain;"
               alt="${product.name}"
               loading ="lazy">
        </div>
      `
      )
      .join("");

    elements.userDisplay.allProducts.innerHTML += `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card h-100">
          <div id="carousel-${
            product.id
          }" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
              ${carouselIndicators}
            </div>
            <div class="carousel-inner text-center">
              ${carouselItems}
            </div>
            ${
              product.images.length > 1
                ? `
            <button class="carousel-control-prev" type="button" 
                    data-bs-target="#carousel-${product.id}" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" 
                    data-bs-target="#carousel-${product.id}" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
            `
                : ""
            }
          </div>
          <div class="product-card-body">
            <h5 class="product-name">${product.name}</h5>
            <span class="product-price mb-2">$${product.price.toFixed(2)}</span>
            <div class="product-meta mb-2">
              <div>
                <i class="fas fa-tag" aria-hidden="true"></i>
                <span class="category-badge">${product.category}</span>
              </div>
              <div><i class="fas fa-user" aria-hidden="true"></i> ${
                product.seller || "Admin"
              }</div>         
              ${
                product.sale
                  ? `<div><i class="fas fa-percent" aria-hidden="true"></i> ${product.sale}</div>`
                  : `<div><i class="fas fa-percent" aria-hidden="true"></i> no sale</div>`
              }
              <div class="product-quantity mb-2">
                <i class="fas fa-boxes" aria-hidden="true"></i> Quantity: ${
                  product.quantity || 0
                }
              </div>
            </div>
            <div class="d-flex justify-content-around mt-3">
              <button class="btn btn-primary px-4 edit-btn" data-product-id="${
                product.id
              }">
                <i class="fas fa-edit me-1" aria-hidden="true"></i> Edit
              </button>
              <button class="btn btn-danger px-4 delete-btn" data-product-id="${
                product.id
              }">
                <i class="fas fa-trash-alt me-1" aria-hidden="true"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  // Initialize carousels after rendering
  document.querySelectorAll(".carousel").forEach((carousel) => {
    new bootstrap.Carousel(carousel);
  });

  // Set up event listeners for product actions
  setupProductEventListeners();
}

function setupProductEventListeners() {
  // Edit product - open modal with product data
  elements.userDisplay.allProducts.addEventListener("click", function (e) {
    const editBtn = e.target.closest(".edit-btn");
    const deleteBtn = e.target.closest(".delete-btn");

    if (editBtn) {
      const productId = parseInt(editBtn.dataset.productId);
      const product = allProducts.find((p) => p.id === productId);

      if (product) {
        populateEditForm(product);
        const editModal = new bootstrap.Modal(
          document.getElementById("productEditModal")
        );
        editModal.show();
      }
    }

    if (deleteBtn) {
      const productId = parseInt(deleteBtn.dataset.productId);
      deleteProduct(productId);
    }
  });

  // Save edited product
  const editProductForm = document.querySelector(".product-edit-form");
  if (editProductForm) {
    editProductForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveEditedProduct();
    });
  }
}
document
  .getElementById("productSaveBtn")
  .addEventListener("click", function () {
    document
      .querySelector(".product-edit-form")
      .dispatchEvent(new Event("submit"));
  });
function populateEditForm(product) {
  document.querySelector(".product-id").value = product.id;
  document.querySelector(".productNameEdit").value = product.name;
  document.querySelector(".productPriceEdit").value = product.price;
  document.querySelector(".product-description").value =
    product.description || "";
  document.querySelector(".productSaleEdit").value =
    parseFloat(product.sale) || 0;
  document.querySelector(".productQuantityEdit").value =
    Number(product.quantity) || 0;

  // Set category select
  const categorySelect = document.querySelector(".product-category");
  if (categorySelect) {
    for (let i = 0; i < categorySelect.options.length; i++) {
      if (categorySelect.options[i].value === product.category) {
        categorySelect.selectedIndex = i;
        break;
      }
    }
  }

  // Set seller select

  const sellerSelect = document.querySelector(".product-seller");
  sellerSelect.innerHTML = `<option value="">Select Seller</option>`;
  sellerSelect.innerHTML += sellers
    .map(
      (user) => `                        
      <option value="${user.userId}">${user.firstName}</option>`
    )
    .join("");

  if (sellerSelect) {
    for (let i = 0; i < sellerSelect.options.length; i++) {
      if (sellerSelect.options[i].text === product.seller) {
        sellerSelect.selectedIndex = i;
        break;
      }
    }
  }

  // Set current image
  const imgElement = document.querySelector(".add-modal__img");
  if (imgElement && product.image) {
    imgElement.src = product.image;
  }
}

async function saveEditedProduct() {
  const productId = parseInt(document.querySelector(".product-id").value);
  const productIndex = allProducts.findIndex((p) => p.id === productId);

  if (productIndex !== -1) {
    const updatedProduct = {
      ...allProducts[productIndex],
      name: document.querySelector(".productNameEdit").value,
      price: parseFloat(document.querySelector(".productPriceEdit").value),
      category: document.querySelector(".product-category").value,
      seller:
        document.querySelector(".product-seller").options[
          document.querySelector(".product-seller").selectedIndex
        ].text,
      createdBy: document.querySelector(".product-seller").value,
      description: document.querySelector(".product-description").value,
      sale:
        parseInt(document.querySelector(".productSaleEdit").value) + "%" || "",
      quantity:
        parseInt(document.querySelector(".productQuantityEdit").value) || 0,
    };

    // Handle image update if a new image was selected
    const imageInput = document.querySelector(".product-image");
    if (imageInput.files.length > 0) {
      updatedProduct.image = URL.createObjectURL(imageInput.files[0]);
      updatedProduct.images = [updatedProduct.image];
    }

    allProducts[productIndex] = updatedProduct;
    localStorage.setItem("allProducts", JSON.stringify(allProducts));
    renderProductSection();
    renderDashboard();

    const editModal = bootstrap.Modal.getInstance(
      document.getElementById("productEditModal")
    );
    editModal.hide();

    await Swal.fire("Success!", "Product updated successfully!", "success");
  }
}

async function deleteProduct(productId) {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    allProducts = allProducts.filter((p) => p.id !== productId);
    localStorage.setItem("allProducts", JSON.stringify(allProducts));
    renderProductSection();
    renderDashboard();
    await Swal.fire("Deleted!", "Product has been deleted.", "success");
  }
}
// Initialize product image preview for add form
const addProductImageInput = document.getElementById("productImage");
if (addProductImageInput) {
  addProductImageInput.addEventListener("input", function () {
    const previewElement = document.getElementById("addProductImagePreview");
    if (previewElement) {
      previewElement.src =
        this.value || "/assets/images/products/default-product.jpg";
    }
  });
}

// Initialize product image preview for edit form
const editProductImageInput = document.querySelector(".product-image");
if (editProductImageInput) {
  editProductImageInput.addEventListener("input", function () {
    const previewElement = document.querySelector(".add-modal__img");
    if (previewElement) {
      previewElement.src =
        this.value || "/assets/images/products/default-product.jpg";
    }
  });
}

// Add product form submission
const addProductForm = document.getElementById("addProductForm");
if (addProductForm) {
  const sellerSelect = document.getElementById("productSeller");
  sellerSelect.innerHTML = `<option value="">Select Seller</option>`;
  sellerSelect.innerHTML += sellers
    .map(
      (user) => `                        
      <option value="${user.userId}">${user.firstName}</option>`
    )
    .join("");
  addProductForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const newProduct = {
      id:
        allProducts.length > 0
          ? Math.max(...allProducts.map((p) => p.id)) + 1
          : 1,
      name: document.getElementById("productName").value,
      price: parseFloat(document.getElementById("productPrice").value),
      category: document.getElementById("productCategory").value,
      seller:
        document.getElementById("productSeller").options[
          document.getElementById("productSeller").selectedIndex
        ].text,
      createdBy: document.getElementById("productSeller").value,
      description: document.getElementById("productDescription").value,
      image:
        document.getElementById("productImage").value ||
        "/assets/images/products/default-product.jpg",
      images: [document.getElementById("productImage").value] || [
        "/assets/images/products/default-product.jpg",
      ],
      quantity: 10, // Default quantity
      rating: 0,
      ratingCount: 0,
      reviews: [],
      sale: `${
        document.querySelector(".product-sale").value.trim() !== ""
          ? document.querySelector(".product-sale").value + `%`
          : ""
      }`,
    };

    allProducts.push(newProduct);
    localStorage.setItem("allProducts", JSON.stringify(allProducts));
    renderProductSection();
    renderDashboard();

    // Reset form and close modal
    addProductForm.reset();
    const addModal = bootstrap.Modal.getInstance(
      document.getElementById("addProductModal")
    );
    addModal.hide();

    await Swal.fire("Success!", "Product added successfully!", "success");
  });
}
//message section
const Messages = {
  // DOM Elements
  elements: {
    container: document.getElementById("messagesContainer"),
    usersContainer: document.getElementById("users-container"),
    noMessage: document.getElementById("noMessage"),
    filterButtons: document.querySelectorAll(".filter-buttons button"),
    modalUserName: document.getElementById("modalUserName"),
    modalMessagesContainer: document.getElementById("modal-messages-container"),
  },

  // Initialize messages dashboard
  init() {
    this.elements.container?.classList.remove("d-none");
    const messages = JSON.parse(localStorage.getItem("contact")) || [];
    const groupedMessages = this.groupMessagesByUser(messages);

    this.renderUserCards(groupedMessages);
    this.setupEventListeners(groupedMessages);
    this.filterMessages("all", groupedMessages);
  },

  // Group messages by user email
  groupMessagesByUser(messages) {
    return messages.reduce((groups, message, index) => {
      const { email } = message;

      if (!groups[email]) {
        groups[email] = {
          name: message.name,
          email,
          phone: message.phone,
          role: message.role || "Customer",
          unread: true,
          messages: [],
        };
      }

      groups[email].messages.push({
        ...message,
        id: index,
      });

      return groups;
    }, {});
  },

  // Render user cards
  renderUserCards(groupedMessages) {
    const { usersContainer, noMessage } = this.elements;
    const hasMessages = Object.keys(groupedMessages).length > 0;

    noMessage.classList.toggle("d-none", hasMessages);
    if (!hasMessages) return;

    usersContainer.innerHTML = Object.entries(groupedMessages)
      .map(([email, user], index) => this.createUserCard(user, index))
      .join("");
  },

  // Create individual user card HTML
  createUserCard(user, index) {
    const roleClass =
      user.role === "Seller" ? "badge-seller" : "badge-customer";

    return `
      <div class="col-md-6 col-lg-4 user-card-container"
           data-role="${user.role}"
           data-unread="${user.unread}"
           data-user-id="${index}">
        <div class="user-card h-100">
          <div class="user-header">
            <h3 class="user-name">${user.name}</h3>
            <span class="badge badge-role ${roleClass}">
              ${user.role}
            </span>
          </div>
          <div class="user-body d-flex align-items-center justify-content-between mt-2 py-4">
            <div>
              <div class="user-detail">
                <i class="fas fa-envelope"></i>
                <span>${user.email}</span>
              </div>
              <div class="user-detail">
                <i class="fas fa-phone"></i>
                <span>${user.phone}</span>
              </div>
            </div>
            <div>
              <button class="messages-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#messagesModal"
                      data-user-id="${index}">
                <i class="fas fa-comments"></i>
                <span class="messages-count">${user.messages.length}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Set up event listeners
  setupEventListeners(groupedMessages) {
    const { filterButtons } = this.elements;

    // Filter buttons
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.id.replace("filter", "").toLowerCase();
        this.filterMessages(filter, groupedMessages);
      });
    });

    // Modal open handler
    document.addEventListener("click", (e) => {
      const messageBtn = e.target.closest(".messages-btn");
      if (messageBtn) {
        this.openUserMessages(messageBtn.dataset.userId, groupedMessages);
      }
    });
  },

  // Filter messages by criteria
  filterMessages(filter, groupedMessages) {
    const { noMessage } = this.elements;
    const userCards = document.querySelectorAll(".user-card-container");
    let hasVisibleCards = false;

    userCards.forEach((card) => {
      const shouldShow =
        filter === "all" ||
        (filter === "customers" && card.dataset.role === "Customer") ||
        (filter === "sellers" && card.dataset.role === "Seller") ||
        (filter === "unread" && card.dataset.unread === "true");

      card.style.display = shouldShow ? "" : "none";
      if (shouldShow) hasVisibleCards = true;
    });

    noMessage.classList.toggle("d-none", hasVisibleCards);
  },

  // Open user messages in modal
  openUserMessages(userId, groupedMessages) {
    const { modalUserName, modalMessagesContainer } = this.elements;
    const user = Object.values(groupedMessages)[userId];

    if (!user) return;

    modalUserName.textContent = user.name;
    modalMessagesContainer.innerHTML = user.messages
      .map(
        (message) => `
        <div class="modal-message">
          <p>${message.message}</p>
          <div class="message-date">${message.date}</div>
        </div>
      `
      )
      .join("");

    // Mark as read
    user.unread = false;
    const userCard = document.querySelector(
      `.user-card-container[data-user-id="${userId}"]`
    );
    if (userCard) userCard.dataset.unread = "false";
  },
};

const support = document.querySelector("[data-show=messagesContainer]");
support.addEventListener("click", () => Messages.init());
// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  init();
});
