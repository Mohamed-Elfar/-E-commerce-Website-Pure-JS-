import { loggout, loginUser } from "/assets/js/utils.js";
/* sidebar */
const sidebarContainer = document.getElementById("sidebarContainer");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("mainContent");
const openBtn = document.getElementById("openSidebar");
const closeBtn = document.getElementById("closeSidebar");
const userName = document.getElementById("userName");
const totalRevenue = document.querySelector(".TotalRevenue");
const TotalRevenueRate = document.querySelector(".TotalRevenueRate");
const inStock = document.querySelector(".inStock");
const totalOrders = document.querySelector(".totalOrders");
const topSellingProducts = document.querySelector(".topSellingProducts");
const flashTable = document.querySelector("table > tbody");
const totalUsers = document.querySelector(".totalUsers");


document.querySelectorAll('.section-toggle-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const targetId = this.getAttribute('data-show');
    const mainContent = document.getElementById('mainContent');
    
    // Hide all sections
    Array.from(mainContent.children).forEach(child => {
      child.classList.add('d-none');
    });
    
    // Show target section
    document.getElementById(targetId).classList.remove('d-none');
  });
});

// const totalUsersRate = document.querySelector(".totalUsersRate");

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

// dashboardBtn.addEventListener("click", () => {
//   loggout();
// });

userName.textContent = loginUser().first_name + " " + loginUser().last_name;
let sum = 0;
let allOrders = 0;
const users = JSON.parse(localStorage.getItem("users"));
const allProducts = JSON.parse(localStorage.getItem("allProducts"));

users.forEach((user) => {
  user.orders?.forEach((order) => {
    allOrders++;
    sum += Number(order.total) || 0;
  });
});
totalRevenue.textContent = "$" + sum.toFixed(2);
totalOrders.innerHTML = allOrders;
//---------------------totalRevenueRate---------------------

const lastDayRevenue = parseFloat(localStorage.getItem("totalRevenuePrevDay"));

let percentDifference;
if (!lastDayRevenue) {
  // First run: Initialize storage, show 0%
  localStorage.setItem("totalRevenuePrevDay", sum.toFixed(2));
  percentDifference = 0;
} else {
  // Normal case: Calculate percentage change
  percentDifference =
    lastDayRevenue === 0 ? 0 : ((sum - lastDayRevenue) / lastDayRevenue) * 100;

  // Force zero if difference is negligible
  if (Math.abs(percentDifference) < 0.001) percentDifference = 0;
}
percentDifference < sum
  ? TotalRevenueRate.classList.add("text-success")
  : TotalRevenueRate.classList.add("text-danger");
TotalRevenueRate.innerHTML += `${
  percentDifference < sum
    ? `<i class="fas fa-arrow-up"></i> ${percentDifference.toFixed(
        2
      )}% from last day`
    : `<i class="fas fa-arrow-down"></i> ${percentDifference.toFixed(
        2
      )}% from last day`
}`;

//---------------------totalRevenueRate-----End----------------
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
          data: product.date,
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
                      src="${product.image}"
                      class="card-img-top w-50"
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
                          ${
                            product.sale.trim() !== ""
                              ? `<span
                            class="text-muted text-decoration-line-through ms-2"
                            >$${(
                              product.price *
                              (1 - parseFloat(product.sale) / 100)
                            ).toFixed(2)}</span
                          >`
                              : ""
                          }
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

const flashSaleProducts = allProducts
  .filter((product) => product.sale.trim() !== "")
  .sort((a, b) => parseFloat(b.sale) - parseFloat(a.sale));

flashTable.innerHTML = flashSaleProducts
  .map(
    (product) => ` <tr>
                      <td>${product.name}</td>
                      <td><span class="badge ${
                        parseFloat(product.sale) > 15
                          ? "bg-danger bg-opacity-10 text-danger"
                          : "bg-success bg-opacity-10 text-success"
                      }">${product.sale}</span></td>
                      <td>${
                        Object.keys(productCounts)
                          .map(Number)
                          .includes(product.id)
                          ? productCounts[product.id].count
                          : 0
                      }</td>
                      <td>$${product.price}</td>
                    </tr>`
  )
  .join("");

//   const monthlySales = Array(12).fill(0); // 12 months

//   users.forEach((user) => {
//     user.orders?.forEach((order) => {
//       const month = new Date(order.date).getMonth();
//       monthlySales[month] += Number(order.total) || 0;
//       console.log(monthlySales);

//     });
//   });
// // Sales Chart
// const salesCtx = document.getElementById("salesChart").getContext("2d");
// window.salesChart = new Chart(salesCtx, {
//   type: "line",
//   data: {
//     labels: [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ],
//     datasets: [
//       {
//         label: "Sales",
//         data: monthlySales,
//         backgroundColor: "rgba(75, 192, 192, 0.2)",
//         borderColor: "rgba(75, 192, 192, 1)",
//         borderWidth: 2,
//         tension: 0.4,
//         fill: true,
//       },
//     ],
//   },
//   options: {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       tooltip: {
//         mode: "index",
//         intersect: false,
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: {
//           callback: function (value) {
//             return "$" + value;
//           },
//         },
//       },
//     },
//   },
// });

const dailySales = Array(7).fill(0);

users.forEach((user) => {
  user.orders?.forEach((order) => {
    const day = new Date(order.date).getDay();
    dailySales[day + 1 > 6 ? 0 : day + 1] += Number(order.total) || 0;
  });
});
// Sales Chart
const salesCtx = document.getElementById("salesChart").getContext("2d");
window.salesChart = new Chart(salesCtx, {
  type: "line",
  data: {
    labels: ["sat", "sun", "mon", "Tue", "Wed", "Thu", "Fri"],

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

totalUsers.textContent = users.length;
