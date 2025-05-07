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
  const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];

  const sellerProducts = allProducts.filter(
    (product) => parseInt(product.createdBy) === currentUser.userId
  );
  console.log(sellerProducts);
  return sellerProducts;
}

export function addProduct(event) {
  event.preventDefault(); 
  const form = event.target;

  if (!validateCategory(form)) {
    return;
  }

  const formObject = new FormData(form);
  const formData = Object.fromEntries(formObject.entries());
  const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];

  const product = {
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

  allProducts.push(product);
  localStorage.setItem("allProducts", JSON.stringify(allProducts));


  const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
  const submitBtn=document.getElementById('submitModal');
  const closeBtn=document.getElementById('closeModal');
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