let container = document.getElementById('order');

function getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    console.log(users.find(user => user.token === token) || null);
    return users.find(user => user.token === token) || null;
}

function getAllMyOrdersWithProducts(orders) {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
  
    let myOrders = [];
  
    orders.forEach(order => {
        // تصفية المنتجات الخاصة بالمستخدم الحالي فقط
        const myProducts = order.products.filter(product => 
            product.createdBy === currentUser.userId.toString()
        );
        
        // إذا كان هناك منتجات خاصة بالمستخدم، نضيف الطلب مع هذه المنتجات فقط
        if (myProducts.length > 0) {
            myOrders.push({
                ...order,
                products: myProducts
            });
        }
    });
  
    return myOrders;
}

const orders = JSON.parse(localStorage.getItem('orders'));  
const myOrders = getAllMyOrdersWithProducts(orders);
console.log(myOrders);

function getDailySalesData(orders) {
    const salesPerDay = {};
  
    orders.forEach(order => {
        const date = new Date(order.date).toISOString().split('T')[0]; // YYYY-MM-DD
        salesPerDay[date] = (salesPerDay[date] || 0) + order.products.length;
    });
  
    // ترتيب حسب التاريخ
    const sortedDates = Object.keys(salesPerDay).sort();
  
    return {
        labels: sortedDates,
        data: sortedDates.map(date => salesPerDay[date])
    };
}

const salesData = getDailySalesData(myOrders);
  
const salesCtx = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(salesCtx, {
    type: 'line',
    data: {
        labels: salesData.labels,
        datasets: [{
            label: 'Daily Sales',
            data: salesData.data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        return value + ' sale' + (value > 1 ? 's' : '');
                    }
                }
            }
        }
    }
});