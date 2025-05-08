import {
  loginUser,
  validateName,
  validatePhone,
  validateEmail,
} from "/assets/js/utils.js";

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
    users: document.querySelector(".totalUsers"),
    flashTable: document.querySelector("table > tbody"),
  },
  sections: {
    users: document.querySelector("[data-show='usersContainer']"),
  },
};

// Data
let users = JSON.parse(localStorage.getItem("users")) || [];
const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];

// Initialize
function init() {
  setupSidebar();
  setupSectionToggles();
  renderDashboard();
  setupCharts();
  startFlashSaleTimer();
  renderUserSection();
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

      // Hide all sections
      Array.from(elements.mainContent.children).forEach((child) => {
        child.classList.add("d-none");
      });

      // Show target section
      document.getElementById(targetId)?.classList.remove("d-none");
    });
  });
}

// Dashboard Rendering
function renderDashboard() {
  const user = loginUser();
  elements.userDisplay.name.textContent = `${user.firstName} ${user.lastName}`;

  // Calculate revenue and orders
  let sum = 0;
  let allOrders = 0;

  users.forEach((user) => {
    user.orders?.forEach((order) => {
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
      ? `<i class="fas fa-arrow-up"></i> ${Math.abs(percentDifference).toFixed(
          2
        )}% from last day`
      : `<i class="fas fa-arrow-down"></i> ${Math.abs(
          percentDifference
        ).toFixed(2)}% from last day`;

  // Stock information
  const productsInStock = allProducts.filter((p) => p.quantity > 0).length;
  const lowStockCount = allProducts.length - productsInStock;

  if (lowStockCount > 0) {
    elements.userDisplay.inStock.classList.remove("d-none");
    elements.userDisplay.inStock.textContent = `${lowStockCount} items low stock`;
  } else {
    elements.userDisplay.inStock.classList.add("d-none");
  }

  // Total users
  const totalUsersCount = users.length > 0 ? users.length - 1 : 0;
  elements.userDisplay.users.textContent = totalUsersCount;

  // Top selling products
  renderTopSellingProducts();
  renderFlashSaleProducts();
}

// Product Rendering
function renderTopSellingProducts() {
  const productCounts = {};

  users.forEach((user) => {
    user.orders?.forEach((order) => {
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
        <img src="${product.image}" class="card-img-top w-50" alt="Product" />
        ${
          product.sale.trim()
            ? `<span class="discount-badge">${product.sale} OFF</span>`
            : ""
        }
        <div class="card-body">
          <h6 class="card-title">${product.name}</h6>
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-danger">$${product.price}</span>
              ${
                product.sale.trim()
                  ? `
                <span class="text-muted text-decoration-line-through ms-2">
                  $${(
                    product.price *
                    (1 - parseFloat(product.sale) / 100)
                  ).toFixed(2)}
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

  users.forEach((user) => {
    user.orders?.forEach((order) => {
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
    .filter((p) => p.sale.trim())
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

  users.forEach((user) => {
    user.orders?.forEach((order) => {
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
  users.slice(1).forEach((user) => {
    const userId = user.userId;
    const userRoleClass =
      user.role === "Seller" ? "role-seller" : "role-customer";

    usersAccordion.innerHTML += `
      <div class="accordion-item mb-2">
        <h2 class="accordion-header" id="heading-${userId}">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" 
            data-bs-target="#collapse-${userId}" aria-expanded="false" aria-controls="collapse-${userId}">
            ${user.firstName} ${user.lastName}
            <span class="user-role ${userRoleClass}">${user.role}</span>
          </button>
        </h2>
        <div id="collapse-${userId}" class="accordion-collapse collapse" 
          aria-labelledby="heading-${userId}" data-bs-parent="#usersAccordion">
          <div class="accordion-body">
            <div class="user-info-item">
              <span class="user-info-label">First Name:</span> ${user.firstName}
            </div>
            <div class="user-info-item">
              <span class="user-info-label">Last Name:</span> ${user.lastName}
            </div>
            <div class="user-info-item">
              <span class="user-info-label">Email:</span> ${user.email}
            </div>
            <div class="user-info-item">
              <span class="user-info-label">Phone:</span> ${user.phone}
            </div>
            <div class="user-info-item">
              <span class="user-info-label">Role:</span> ${user.role}
            </div>
            <div class="mt-3">
              <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal-${userId}">
                <i class="fas fa-edit me-1"></i> Edit
              </button>
              <button class="btn btn-danger ms-2" onclick="window.deleteUser(${userId})">
                <i class="fas fa-trash-alt me-1"></i> Delete
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
                    value="${user.firstName}" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Last Name</label>
                  <input type="text" class="form-control" id="modal-${userId}-lastName" 
                    value="${user.lastName}" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" id="modal-${userId}-email" 
                    value="${user.email}" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Phone</label>
                  <input type="tel" class="form-control" id="modal-${userId}-phone" 
                    value="${user.phone}" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Role</label>
                  <select class="form-select" id="modal-${userId}-role" required>
                    <option value="Customer" ${
                      user.role === "Customer" ? "selected" : ""
                    }>Customer</option>
                    <option value="Seller" ${
                      user.role === "Seller" ? "selected" : ""
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

  const wantedSellers = users.filter((user) => user.want_to_be_seller);
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
      <div class="request-username">${user.firstName} ${user.lastName}</div>
      <div class="request-email">${user.email}</div>
      <div class="mt-2">
        <button class="btn btn-success btn-accept" onclick="window.approveSeller(${user.userId})">
          <i class="fas fa-check me-1"></i> Approve
        </button>
        <button class="btn btn-danger btn-reject" onclick="window.rejectSeller(${user.userId})">
          <i class="fas fa-times me-1"></i> Reject
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
    if (!validateName(inputs.firstName) || !validateName(inputs.lastName)) {
      throw new Error("Please enter valid names");
    }
    if (!validateEmail(inputs.email)) {
      throw new Error("Please enter a valid email");
    }
    if (!validatePhone(inputs.phone)) {
      throw new Error("Please enter a valid phone number");
    }

    // Update user
    const userIndex = users.findIndex((u) => u.userId === userId);
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

  users = users.filter((u) => u.userId !== userId);
  localStorage.setItem("users", JSON.stringify(users));

  await Swal.fire("Deleted!", "User has been deleted.", "success");
  renderUserSection();
};

window.approveSeller = async function (userId) {
  const userIndex = users.findIndex((u) => u.userId === userId);
  if (userIndex === -1) return;

  users[userIndex] = {
    ...users[userIndex],
    role: "Seller",
    want_to_be_seller: false,
  };

  localStorage.setItem("users", JSON.stringify(users));
  await Swal.fire("Approved!", "User is now a seller.", "success");
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
  await Swal.fire("Rejected!", "Seller request rejected.", "success");
  renderSellerApplications();
};

// Initialize the application
document.addEventListener("DOMContentLoaded", init);
