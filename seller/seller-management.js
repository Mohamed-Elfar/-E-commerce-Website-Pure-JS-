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
// test
const currentUser = getCurrentUser();
if (currentUser) {
  console.log("Current user:", currentUser);
  console.log("User ID:", currentUser.userId);
  console.log("Role:", currentUser.role);
} else {
  console.log("No user logged in");
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
fetchSellerProducts();
