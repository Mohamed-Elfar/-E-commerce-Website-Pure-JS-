import { loginUser } from "/assets/js/utils.js";

let container = document.getElementById("order");

function getAllMyOrdersWithProducts(orders) {
  const currentUser = loginUser();
  if (!currentUser) return [];

  let myOrders = [];

  orders.forEach((order) => {
    const myProducts = order.products.filter(
      (product) => product.createdBy === currentUser.userId.toString()
    );

    if (myProducts.length > 0) {
      myOrders.push({
        ...order,
        products: myProducts,
      });
    }
  });

  return myOrders;
}

const orders = JSON.parse(localStorage.getItem("orders"));
const myOrders = getAllMyOrdersWithProducts(orders);
console.log(myOrders);
function getWeeklySalesData(orders) {
  // إنشاء تاريخ بداية الأسبوع (الأحد) ونهايته (السبت)
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 لأحد، 6 لسبت
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // تهيئة كائن لتخزين المبيعات لكل يوم
  const salesPerDay = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };

  // تعبئة بيانات المبيعات لكل يوم
  orders.forEach((order) => {
    const orderDate = new Date(order.date);
    if (orderDate >= startOfWeek && orderDate <= endOfWeek) {
      const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
        orderDate.getDay()
      ];
      salesPerDay[dayName] += order.products.length;
    }
  });

  return {
    labels: Object.keys(salesPerDay),
    data: Object.values(salesPerDay),
  };
}

const weeklySalesData = getWeeklySalesData(myOrders);
console.log("Weekly Sales Data:", weeklySalesData);

const salesCtx = document.getElementById("salesChart").getContext("2d");
const salesChart = new Chart(salesCtx, {
  type: "line",
  data: {
    labels: weeklySalesData.labels,
    datasets: [
      {
        label: "Weekly Sales",
        data: weeklySalesData.data,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointRadius: 5,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            return `${ctx.raw} sale${ctx.raw !== 1 ? "s" : ""}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(...weeklySalesData.data, 10),
        ticks: {
          callback: (val) => `${val} sale${val !== 1 ? "s" : ""}`,
        },
      },
    },
  },
});
