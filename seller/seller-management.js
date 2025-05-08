import { showToast } from "../../assets/js/utils.js";

function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.token === token);
  return user || null;
}

function fetchSellerProducts() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    showToast("error", "Please log in first");
    return [];
  }

  //   if (currentUser.role !== "Seller" || !currentUser.want_to_be_seller) {
  //     showToast("error", "Only sellers have the access");
  //     return [];
  //   }
  let allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];

  let sellerProducts = allProducts.filter(
    (product) => Number(product.createdBy) === currentUser.userId
  );
  console.log(sellerProducts);
  // console.log(allProducts)
  return sellerProducts;
}
fetchSellerProducts();
function addProduct(event) {
  event.preventDefault();
  const form = event.target;

  if (!validateCategory(form)) {
    return;
  }

  const formObject = new FormData(form);
  const formData = Object.fromEntries(formObject.entries());
  let allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];

  const productId = parseInt(formData.id);
  const isUpdating = !isNaN(productId) && productId > 0;
  const updatableProduct = allProducts.find((p) => p.id === productId);

  let product = {
    id: isUpdating ? productId : Date.now(),
    name: formData.name,
    description: formData.description,
    category: formData.category,
    image: formData.image,
    price: parseFloat(formData.price),
    quantity: Number(formData.quantity),
    sale: parseFloat(formData.sale) || "",
    createdBy: getCurrentUser().userId.toString(),
    rating: isUpdating ? updatableProduct.rating : 0.0,
    ratingCount: isUpdating ? updatableProduct.ratingCount : 0,
    count: isUpdating ? updatableProduct.count : 1,
    reviews: isUpdating ? updatableProduct.reviews : [],
    images: [
      formData.image2 || "",
      formData.image3 || "",
      formData.image4 || "",
      formData.image5 || ""
    ],
  };

  if (isUpdating) {
    const index = allProducts.findIndex((p) => p.id === productId);
    if (index !== -1) {
      allProducts[index] = product;
      showToast('success', 'Product updated successfully!');
    } else {
      showToast('error', 'Product not found');
    }
  } else {
    allProducts.push(product);
    showToast('success', 'Product added successfully!');
  }
  localStorage.setItem("allProducts", JSON.stringify(allProducts));
  displayProducts();

  const modalTitle = document.getElementById("productModalLabel");
  modalTitle.textContent = "Add New Product";

  const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));

  modal.hide();
  document.getElementById('submitModal').blur();

  form.reset();

}

let form = document.getElementById("productForm");
form.addEventListener("submit", addProduct);

function updateProduct(productId) {
  const sellerProducts = fetchSellerProducts();
  const product = sellerProducts.find((p) => p.id === productId);
  if (!product) {
    showToast('error', 'Product not found');
    return;
  }
  const productForm = document.querySelector('#productForm');
  const values = {
    id: productId,
    name: product.name,
    description: product.description,
    category: product.category,
    image: product.image,
    price: product.price,
    quantity: product.quantity,
    sale: product.sale ? String(product.sale) : '',
    image2: product.images[0],
    image3: product.images[1],
    image4: product.images[2],
    image5: product.images[3],
  }
  for (const input of productForm.elements) {
    if (values.hasOwnProperty(input.name)) {
      input.value = values[input.name];
    }
  }

  const modalTitle = document.getElementById("productModalLabel");
  if (modalTitle) {
    modalTitle.textContent = "Update Product";
  }

  const modalElement = document.getElementById('productModal');
  if (!modalElement) {
    showToast('error', 'Modal element not found');
    return;
  }
  let modal = bootstrap.Modal.getInstance(modalElement);
  if (!modal) {
    modal = new bootstrap.Modal(modalElement);
  }

  modal.show();
}

function validateCategory(form) {
  if (form['category'].value == 'Choose Category') {
    showToast('warning', `Please choose a category`);
    form['category'].focus();
    return false;
  }
  return true;
}

function displayProducts() {
  const tbody = document.querySelector('table tbody');
  const container = document.getElementById('productCards');
  const sellerProducts = fetchSellerProducts();
  container.innerHTML = '';
  tbody.innerHTML = '';
  sellerProducts.map((product) => {
    const card = document.createElement('div');
    card.className = 'col mb-4';
    card.innerHTML = `
        <div class="card h-100 border-0 shadow-sm p-3 d-xxl-none">
          <div class="d-flex flex-sm-row flex-column position-relative">
             <img src="${product.image}" 
                 class="p-1 w-100 w-sm-auto" 
                 style="height: 160px; max-width: 160px; object-fit: contain; background: linear-gradient(145deg, #f8f9fa, #e9ecef);" 
                 alt="${product.name}" 
                 onerror="this.src='https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?t=st=1746629522~exp=1746633122~hmac=d7ab6887b8e97559468627d4f72ce44616d158a31eb77d05b688edf831fef7e3&w=826'">
            <div class="card-body p-3">
              <div class="d-flex flex-column-reverse flex-sm-row">
             <div class="">
              <h5 class="card-title fs-5 fw-semibold">${product.name}</h5>
              <p class="card-text text-muted fs-6 mb-1">${product.description}}</p>
             </div>
            <div class="d-flex align-items-start mb-2">
                <button aria-label="Update Product" type="button" class="btn btn-sm btn-outline-primary mx-2 update-btn" data-id="${product.id}">
                  <i class="fas fa-edit"></i>
                </button>
                <button aria-label="Delete Product" type="button" class="btn btn-sm btn-outline-danger delete-btn" data-id="${product.id}">
                  <i class="fas fa-trash-alt"></i>
                </button>
                
              </div>
            </div>

              <div class="row g-2 d-flex flex-column flex-sm-row">
                <div class="col-6">
                  <p class="card-text fs-6"><strong>Category:</strong> ${product.category}</p>
                  <p class="card-text fs-6"><strong>Price:</strong> $${parseFloat(product.price).toFixed(2)}</p>
                  <p class="card-text fs-6">
                    <strong>Discount:</strong> 
                    ${product.sale ? `<span class="badge bg-danger">${product.sale}%</span>` : '-'}
                  </p>
                </div>
                <div class="col-6">
                  <p class="card-text fs-6">
                    <strong>Stock:</strong> 
                    <span class="badge ${Number(product.quantity) > 0 ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}">
                      ${Number(product.quantity) > 0 ? product.quantity + ' in Stock' : 'Out of Stock'}
                    </span>
                  </p>
                  <p class="card-text fs-6">
                    <strong>Rating:</strong> 
                    <span class="rating-stars">${product.rating}
                      <i class="fa-solid fa-star text-warning"></i>
                      (${product.ratingCount})
                    </span>
                  </p>
                  <p class="card-text fs-6"><strong>Reviews:</strong> ${product.reviews.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    container.insertBefore(card, container.firstChild);
  });
  sellerProducts.map((product) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${product.id}</td>
        <td class="d-flex align-items-center justify-content-center">
          <div class="d-flex align-items-center text-start">
              <img src="${product.image}" class="product-img img-fluid me-3" style="width: 70px;" alt="${product.name}" 
                 onerror="this.src='https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?t=st=1746629522~exp=1746633122~hmac=d7ab6887b8e97559468627d4f72ce44616d158a31eb77d05b688edf831fef7e3&w=826'">
              <div>
                 <div class="fw-medium fs-7">${product.name.substring(0, 30)}${product.name.length > 30 ? '...' : ''}</div>
              <small class="text-muted">${product.description.substring(0, 30)}${product.description.length > 30 ? '...' : ''}</small>
          </div>
          </div>
        </td>
        <td>${product.category}</td>
        <td>$${parseFloat(product.price).toFixed(2)}</td>
        <td> ${product.sale ? `<span class="badge bg-danger">${product.sale}%</span>` : '-'}</td>
        <td>
         <span class="badge ${Number(product.quantity) > 0 ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}">
          ${Number(product.quantity) > 0 ? product.quantity + ' in Stock' : 'Out of Stock'}
        </span>
        </td>
        <td>
          <span class="rating-stars ms-1">${product.rating}
            <i class="product__rating-star fa-solid fa-star me-2"></i>
            (${product.ratingCount})
          </span>
        </td>
        <td>${product.reviews.length}</td>
        <td>
          <div class="action-btns d-flex">
            <button aria-label="Update Product" type="button" class="btn btn-sm btn-outline-primary me-2 update-btn" data-id="${product.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button aria-label="Delete Product" type="button" class="btn btn-sm btn-outline-danger delete-btn" data-id="${product.id}">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </td>
      `;
    tbody.insertBefore(row, tbody.firstChild);
  });
};
displayProducts();

document.addEventListener('click', (event) => {
  if (event.target.closest('.update-btn')) {
    const button = event.target.closest('.update-btn');
    const productId = parseInt(button.dataset.id);
    updateProduct(productId);
  }
});

// solve Blocked aria-hidden issue
document.getElementById('closeModal').addEventListener('click', function () {
  moveFocus();
});

document.querySelector('.btn-close').addEventListener('click', function () {
  moveFocus();
});

function moveFocus() {
  const openModalButton = document.querySelector('button[data-bs-target="#productModal"]');
  if (openModalButton) {
    openModalButton.focus();
  }
}