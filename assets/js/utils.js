export function showToast(status, message) {
  var toast = document.querySelector(".toast");
  toast.classList.remove("toast-error", "toast-success");
  if (status == "success") {
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
    toast.classList.add("show", "toast-success");
  } else if (status == "error") {
    toast.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${message} `;
    toast.classList.add("show", "toast-error");
  } else {
    throw new Error("Invalid status");
  }
  setTimeout(function () {
    toast.classList.remove("show");
  }, 3000);
}

export function validateName(input) {
  var reName = /^[a-zA-Z ]{3,10}$/;
  if (!reName.test(input.value)) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    return false;
  } else {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    return true;
  }
}

export function validateEmail(input) {
  var reEmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!reEmail.test(input.value)) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");

    return false;
  } else {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    return true;
  }
}

export function validatePhone(input) {
  var rePhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  if (!rePhone.test(input.value)) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");

    return false;
  } else {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    return true;
  }
}

export function validatePassword(input) {
  var rePassword =
    /^(?=.*[A-Z])(?=.*[a-zA-Z0-9])(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~\-]).{6,}$/;
  if (!rePassword.test(input.value)) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    return false;
  } else {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    return true;
  }
}

export function validatePasswordMatch(password, confirmPassword) {
  if (password.value !== confirmPassword.value) {
    confirmPassword.classList.add("is-invalid");
    confirmPassword.classList.remove("is-valid");
    return false;
  } else {
    confirmPassword.classList.remove("is-invalid");
    confirmPassword.classList.add("is-valid");
    return true;
  }
}

export function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart.includes(productId)) {
    cart.push(productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    showToast("success", "Added to cart!");
  } else {
    showToast("success", "Added to cart!");
  }
}

export function addToWishList(productId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    showToast("success", "Product Added to Your Wish List");
  }
}

export function redirectToNotFoundPage(condition) {
  if (condition){
    window.location.href = "/404.html"
  }
}
