import { loggout, loginUser } from "/assets/js/utils.js";
/* sidebar */
const sidebarContainer = document.getElementById("sidebarContainer");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("mainContent");
const openBtn = document.getElementById("openSidebar");
const closeBtn = document.getElementById("closeSidebar");
const userName = document.getElementById("userName");
const totalRevenue = document.querySelector(".TotalRevenue");
const inStock = document.querySelector(".inStock");
const totalOrders = document.querySelector(".totalOrders");
const topSellingProducts = document.querySelector(".topSellingProducts");
// Initial state
if (sidebarContainer.classList.contains("collapsed")) {
  openBtn.style.display = "block";
  closeBtn.style.display = "none";
  mainContent.classList.add("full");
} else {
  openBtn.style.display = "none";
  closeBtn.style.display = "block";
  mainContent.classList.remove("full");
}

// Open sidebar
openBtn.addEventListener("click", () => {
  sidebarContainer.classList.remove("collapsed");
  mainContent.classList.remove("full");
  openBtn.style.display = "none";
  closeBtn.style.display = "block";
});

// Close sidebar
closeBtn.addEventListener("click", () => {
  sidebarContainer.classList.add("collapsed");
  mainContent.classList.add("full");
  openBtn.style.display = "block";
  closeBtn.style.display = "none";
});

/* main content */
// Sales Chart
const salesCtx = document.getElementById("salesChart").getContext("2d");
window.salesChart = new Chart(salesCtx, {
  type: "line",
  data: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Sales",
        data: [
          1200, 1900, 1500, 2000, 1800, 2100, 2400, 2200, 2500, 2800, 3000,
          3200,
        ],
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
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "$" + value;
          },
        },
      },
    },
  },
});

// Category Chart
const categoryCtx = document.getElementById("categoryChart").getContext("2d");
window.categoryChart = new Chart(categoryCtx, {
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
        data: [35, 25, 20, 10, 10],
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
      legend: {
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.label + ": " + context.raw + "%";
          },
        },
      },
    },
  },
});

// Flash Sale Timer
function updateFlashSaleTimer() {
  let hours = document.getElementById("flashSaleHours");
  let minutes = document.getElementById("flashSaleMinutes");
  let seconds = document.getElementById("flashSaleSeconds");

  let h = parseInt(hours.textContent);
  let m = parseInt(minutes.textContent);
  let s = parseInt(seconds.textContent);

  s--;
  if (s < 0) {
    s = 59;
    m--;
    if (m < 0) {
      m = 59;
      h--;
    }
  }

  hours.textContent = h.toString().padStart(2, "0");
  minutes.textContent = m.toString().padStart(2, "0");
  seconds.textContent = s.toString().padStart(2, "0");
}

setInterval(updateFlashSaleTimer, 1000);

dashboardBtn.addEventListener("click", () => {
  loggout();
});

// console.log(loginUser());
userName.textContent = loginUser().first_name + " " + loginUser().last_name;
let sum = 0;
let allOrders = 0;
const users = JSON.parse(localStorage.getItem("users"));
users.forEach((user) => {
  user.orders?.forEach((order) => {
    allOrders++;
    sum += Number(order.total) || 0;
  });
});
totalRevenue.textContent = "$" + sum.toFixed(2);
totalOrders.innerHTML = allOrders;

const allProducts = JSON.parse(localStorage.getItem("allProducts"));
const numOfpProducts = allProducts.length;
const productsInStok = allProducts.filter(
  (product) => product.quantity > 0
).length;
const restInStock = numOfpProducts - productsInStok;
if (restInStock > 0) {
  inStock.classList.remove("d-none");
  inStock.innerHTML += `${restInStock} items low stock`;
} else {
  inStock.classList.add("d-none");
}

const productCounts = {};

users?.forEach((user) => {
  user.orders?.forEach((order) => {
    order.products?.forEach((product) => {
      if (productCounts[product.id]) {
        productCounts[product.id].count += product.count || 0;
      } else {
        productCounts[product.id] = {
          id: product.id,
          name: product.name,
          count: product.count || 0,
          image: product.image,
          sale: product.sale,
          price: product.price,
        };
      }
    });
  });
});

const sortedProducts = Object.values(productCounts).sort(
  (a, b) => b.count - a.count
);
const top4Products = sortedProducts.slice(0, 4);

topSellingProducts.innerHTML = top4Products
  .map(
    (product) => `
  
   <div class="col-sm-6 col-md-6 col-lg-6 mb-3">
                  <div class="card product-card h-100">
                    <img
                      src=${product.image}
                      class="card-img-top"
                      alt="Product"
                    />
                    ${
                      product.sale.trim() !== ""
                        ? `<span class="discount-badge">${product.sale} OFF</span>`
                        : ""
                    }
                    <div class="card-body">
                      <h6 class="card-title">${product.name}</h6>
                      <div
                        class="d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <span class="text-danger">$${product.price}</span>
                          <span
                            class="text-muted text-decoration-line-through ms-2"
                            >$200</span
                          >
                        </div>
                        <span class="text-muted small">${
                          product.count
                        } sold</span>
                      </div>
                    </div>
                  </div>
                </div>
  `
  )
  .join("");
