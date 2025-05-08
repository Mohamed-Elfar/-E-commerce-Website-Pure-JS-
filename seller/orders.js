let conatiner= document.getElementById('order')
function getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    console.log(users.find(user => user.token === token) || null)
    return users.find(user => user.token === token) || null;
  }  
  function getAllMyOrderedProducts(orders) {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
  
    let allMyProducts = [];
  
    orders.forEach(order => {
      const myProducts = order.products.filter(product => product.createdBy === currentUser.userId.toString());
      allMyProducts.push(...myProducts);
    });
  
    return allMyProducts;
  }
  
  const orders = JSON.parse(localStorage.getItem('orders'));  
  const myOrderedProducts = getAllMyOrderedProducts(orders);
  console.log(myOrderedProducts);
  myOrderedProducts.forEach(product=>{
    conatiner.innerHTML +=`
    <div class="order-card card mb-3">
    <div class="card-header bg-light d-flex justify-content-between align-items-center">
        <div>
            <span class="fw-bold">#ORD-${product.id}</span>
        </div>
        <span class="status-badge delivered">
            <i class="fas fa-check-circle me-1"></i> Delivered
        </span>
    </div>
    <div class="card-body">
        <div class="row mb-3">
            <div class="col-12 col-md-6 d-flex align-items-center mb-2 mb-md-0">
                <img src="${product.image}" alt="Product" class="product-img me-3">
                <div>
                    <h6 class="mb-0">${product.name}</h6>
                    <small class="text-muted">Qty: ${product.quantity}  <span style="${
                        product.sale ? "" : "visibility: hidden"
                      }">| Sale: ${product.sale}</span> </small>
                </div>
        </div>
    </div>
    <div class="card-footer bg-light d-flex justify-content-between align-items-center">
        <div class="fw-bold">
            Price: ${product.price}$ 
        </div>
    </div>
   </div>
    `
  })
