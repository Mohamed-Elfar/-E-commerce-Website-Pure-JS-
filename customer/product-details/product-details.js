import {
  showToast,
  addToCart,
  redirectToNotFoundPage,
} from "/assets/js/utils.js";

const productId = parseInt(new URLSearchParams(location.search).get("id"));

const products = JSON.parse(localStorage.getItem("allProducts") || []);
const product = products.find((p) => p.id === productId);

/* not found page */
redirectToNotFoundPage(!productId || isNaN(productId) || !product);

const productName = document.getElementById("productName");
const productQuantity = document.getElementById("productQuantity");
const productPrice = document.getElementById("productPrice");
const productDesc = document.getElementById("productDesc");
const sideImgs = document.getElementById("sideImgs");
const mainImg = document.getElementById("mainImg");
const reviewsList = document.getElementById("reviewsList");
const reviewsNumber = document.getElementById("reviewsNumber");
const reviewInput = document.getElementById("reviewInput");
const addReviewBtn = document.getElementById("addReviewBtn");
const ratingCount = document.getElementById("ratingCount");
const ratingStars = document.getElementById("ratingStars");
const addToCartBtn = document.getElementById("addToCartBtn");
const wishListBtn = document.getElementById("wishListBtn");
const decreaseBtn = document.getElementById("decreaseBtn");
const increaseBtn = document.getElementById("increaseBtn");
const quantity = document.getElementById("quantity");
const totalPrice = document.getElementById("totalPrice");

function displayProductDetails() {
  /* images */
  if (product.images.length > 0) {
    mainImg.src = product.images[0];
  }
  if (product.images.length > 0) {
    let box = "";
    for (let i = 0; i < product.images.length; i++) {
      box += `
          <img
          class="side-imgs__img img-thumbnail ${i === 0 ? "active-img" : ""}"
          src="${product.images[i]}"
          alt="controller."
        />
          `;
    }
    sideImgs.innerHTML = box;
    const sideImgsAll = document.querySelectorAll(".side-imgs__img");
    for (let i = 0; i < sideImgsAll.length; i++) {
      sideImgsAll[i].addEventListener("click", function (e) {
        sideImgsAll.forEach((img) => img.classList.remove("active-img"));
        let targetImg = e.target;
        targetImg.classList.add("active-img");
        mainImg.src = targetImg.src;
      });
    }
  }
  /* other data */
  productName.textContent = product.name;
  productPrice.textContent = `$${product.price.toFixed(2)}`;
  productQuantity.textContent += product.quantity;
  productDesc.textContent = product.description;
  /* reviews */
  reviewsNumber.textContent = product.reviews?.length || 0;
  if (product.reviews.length > 0) {
    let reviewItem = "";
    product.reviews.forEach((review) => {
      reviewItem += `
      <li class="mb-3 border-bottom pb-2">
      <strong>${review.username}</strong>
      <small class="text-muted ms-4">${review.date}</small>
      <p class="mt-2">${review.comment}</p>
      </li>
      `;
    });
    reviewsList.innerHTML = reviewItem;
  } else {
    reviewsList.innerHTML = `<li class="text-muted">No reviews yet!</li>`;
  }

  /* rating start and count */
  ratingCount.textContent = `(${product.ratingCount})`;
  ratingStars.innerHTML = [...Array(5)]
    .map((_, i) => {
      return `<i class="fa-${
        i < product.rating ? "solid" : "regular"
      } fa-star ${
        i < product.rating ? "gold" : "text-muted"
      }" aria-hidden="true"></i>`;
    })
    .join("");
}
displayProductDetails();

/* add review */
addReviewBtn.addEventListener("click", function () {
  const comment = reviewInput.value.trim();
  if (comment === "") {
    showToast("error", "please add a review before submitting!");
    return;
  }

  const token = localStorage.getItem("token");
  console.log(token);
  if (!token) {
    showToast("error", "please login first to add review");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || []);
  const currentUser = users.find((user) => user.token === token);
  console.log(currentUser);
  if (!currentUser) {
    showToast("error", "invalid user, please login again !");
    return;
  }

  const firstName = currentUser.firstName;
  const lastName = currentUser.lastName;
  const userName = firstName + " " + lastName;
  const today = new Date();
  const reviewDate = today.toLocaleDateString("en-CA");
  const newReview = {
    username: userName,
    date: reviewDate,
    comment: comment,
  };

  product.reviews.push(newReview);

  const updatedProducts = products.map((p) =>
    p.id === product.id ? product : p
  );
  localStorage.setItem("allProducts", JSON.stringify(updatedProducts));

  const li = document.createElement("li");
  li.className = "mb-3 border-bottom pb-2";
  li.innerHTML = `
  <strong>${userName}</strong>
  <small class="text-muted ms-4">${reviewDate}</small>
  <p class="mt-2">${comment}</p>
  `;

  reviewsList.appendChild(li);
  let currentReviewsCount = parseInt(reviewsNumber.textContent);
  reviewsNumber.textContent = currentReviewsCount + 1;
  showToast("success", "review added successfully");

  /* clear textarea */
  reviewInput.value = "";
});

/* product quantity */
let currentCount = product.count;

function updateQuantityAndPrice() {
  quantity.textContent = currentCount;
  decreaseBtn.disabled = currentCount <= 1;
  increaseBtn.disabled = currentCount >= product.quantity;

  productQuantity.classList.remove("text-success", "text-danger");

  if (product.quantity > 0) {
    productQuantity.classList.add("text-success");
    addToCartBtn.disabled = false;
    addToCartBtn.textContent = "Buy Now";
  } else {
    productQuantity.classList.add("text-danger");
    addToCartBtn.disabled = true;
    addToCartBtn.textContent = "Sold Out";
  }

  const total = currentCount * product.price;
  totalPrice.textContent = `$${total.toFixed(2)}`;
}
updateQuantityAndPrice();

decreaseBtn.addEventListener("click", function () {
  if (currentCount > 1) {
    currentCount--;
    product.count = currentCount;
    updateQuantityAndPrice();
  }
});

increaseBtn.addEventListener("click", function () {
  if (currentCount < product.quantity) {
    currentCount++;
    product.count = currentCount;
    updateQuantityAndPrice();
  }
});

/* add to cart */
addToCartBtn.addEventListener("click", () => {
  if (addToCartBtn.disabled) return;
  const added = addToCart(product);
  if (added) {
    window.location.href = "../checkout/checkout.html";
  }
});

/* add to wishlist */
wishListBtn.addEventListener("click", () => addToWishList(product.id));
