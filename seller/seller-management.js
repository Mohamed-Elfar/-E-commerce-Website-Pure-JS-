import { showToast } from "../../assets/js/utils.js";

export function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.token === token);
  return user || null;
}

export function fetchSellerProducts() {
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
    (product) => parseInt(product.createdBy) === currentUser.userId
  );
  console.log(sellerProducts);
  console.log(allProducts)
  return sellerProducts;
}
fetchSellerProducts();
export function addProduct(event) {
  event.preventDefault();
  const form = event.target;

  if (!validateCategory(form)) {
    return;
  }

  const formObject = new FormData(form);
  const formData = Object.fromEntries(formObject.entries());
  let allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];

  let product = {
    id: allProducts.length + 1,
    name: formData.name,
    description: formData.description,
    category: formData.category,
    image: formData.image,
    price: parseFloat(formData.price),
    quantity: parseInt(formData.quantity),
    sale: parseFloat(formData.sale) || "",
    createdBy: getCurrentUser().userId.toString(),
    rating: 0.0,
    ratingCount: 0,
    count: 1,
    reviews: [],
    images: [
      formData.image2 || "",
      formData.image3 || "",
      formData.image4 || "",
      formData.image5 || ""
    ],
  };

  // allProducts.push(product);
  // localStorage.setItem("allProducts", JSON.stringify(allProducts));


  const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
  const submitBtn = document.getElementById('submitModal');
  const closeBtn = document.getElementById('closeModal');
  modal.hide();
  closeBtn.blur();
  submitBtn.blur();
  form.reset();

  showToast('success', 'Product added successfully!');
}

let form = document.getElementById("productForm");
form.addEventListener("submit", addProduct);

function validateCategory(form) {
  if (form['category'].value == 'Choose Category') {
    showToast('warning', `Please choose a category`);
    form['category'].focus();
    return false;
  }
  return true;
}



function addProductToTable() {
  const tbody = document.querySelector('table tbody');

  let sellerProducts = fetchSellerProducts();
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
         <span class="badge ${parseInt(product.quantity) > 0 ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}">
          ${parseInt(product.quantity) > 0 ? product.quantity + ' in Stock' : 'Out of Stock'}
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
            <button class="btn btn-sm btn-outline-primary me-2" onclick="editProduct(this)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(this)">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </td>
      `;
    tbody.insertBefore(row, tbody.firstChild);
  });

}
addProductToTable();