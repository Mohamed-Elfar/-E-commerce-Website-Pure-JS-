import { loginUser } from "/assets/js/utils.js";
const user = loginUser();

const elements = {
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

let users = JSON.parse(localStorage.getItem("users")) || [];
let allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];

function init() {
  renderDashboard();
  setupCharts();
  startFlashSaleTimer();
}

function renderDashboard() {
  elements.userDisplay.name.textContent = `${user.firstName} ${user.lastName}`;

  let sum = 0;
  let allOrders = 0;

  const myProductsOrders = users
    .flatMap((user) => user.orders || [])
    .flatMap((order) => order.products || [])
    .filter((product) => product.createdBy === user.userId.toString());

  console.log(myProductsOrders);
  let orderSum = 0;
  myProductsOrders.forEach((product) => {
    orderSum += Number(product.price) * product.count || 0;
  });
  console.log(orderSum.toFixed(2));

  users.forEach((user) => {
    user.orders?.forEach((order) => {
      allOrders++;
      sum += Number(order.total) || 0;
    });
  });

  elements.userDisplay.revenue.textContent = `$${orderSum.toFixed(2)}`;
  elements.userDisplay.orders.textContent = myProductsOrders.length;

  let myProducts = allProducts.filter(
    (p) => p.createdBy === user.userId.toString()
  );
  const productsInStock = myProducts.filter((p) => p.quantity > 0).length;
  elements.userDisplay.totalProductsNum.textContent = myProducts.length;
  const lowStockCount = myProducts.length - productsInStock;

  if (lowStockCount > 0) {
    elements.userDisplay.inStock.classList.remove("d-none");
    elements.userDisplay.inStock.innerHTML = `<i class="fas fa-arrow-down" aria-hidden="true"></i> ${lowStockCount} items low stock`;
  } else {
    elements.userDisplay.inStock.classList.add("d-none");
  }

  renderTopSellingProducts();
  renderFlashSaleProducts();
}

function renderTopSellingProducts() {
  const productCounts = {};

  users.forEach((user) => {
    user.orders?.forEach((order) => {
      order.products?.forEach((product) => {
        if (product.createdBy === user.userId.toString()) {
          if (!productCounts[product.id]) {
            productCounts[product.id] = {
              count: product.count || 0,
              name: product.name,
              image: product.image,
              price: product.price,
              sale: product.sale,
            };
          } else {
            productCounts[product.id].count += product.count || 0;
          }
        } else {
          if (!productCounts[product.id]) {
            productCounts[product.id] = {
              count: product.count || 0,
              name: product.name,
              image: product.image,
              price: product.price,
              sale: product.sale,
            };
          }
        }
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
  let myProducts = allProducts.filter(
    (p) => p.createdBy === user.userId.toString()
  );
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

  const flashProducts = myProducts
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

function setupCharts() {
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
}

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

document.addEventListener("DOMContentLoaded", () => {
  init();
});
