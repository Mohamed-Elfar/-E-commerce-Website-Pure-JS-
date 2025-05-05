export function showToast(status, message) {
  const toast = document.querySelector(".toast");
  if (!toast) {
    console.error("Toast element not found in DOM");
    return;
  }

  toast.className = "toast";

  const icons = {
    success: "fa-circle-check",
    error: "fa-triangle-exclamation",
    warning: "fa-warning",
    info: "fa-info",
  };

  if (!icons[status]) {
    console.error(`Invalid toast status: ${status}`);
    return;
  }

  toast.innerHTML = `<i class="fa-solid ${icons[status]}"></i> ${message}`;
  toast.classList.add("show", `toast-${status}`);

  setTimeout(() => toast.classList.remove("show"), 3000);
}

export function validateName(input) {
  var name = /^[a-zA-Z]{3,10}$/;
  if (!name.test(input.value)) {
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
  const phone = /^(010|011|012|015)\d{8}$/;
  if (!phone.test(input.value)) {
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
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z0-9])(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\|`~\-]).{6,}$/;
  
  if (!passwordRegex.test(input.value)) {
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

export function addToCart(product) {
  if (localStorage.getItem("token")) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const productExists = cart.some((item) => item.id === product.id);

    if (!productExists) {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      showToast("success", "Added to cart!");
      return true;
    } else {
      showToast("info", "Product is already in your cart");
      return false;
    }
  } else {
    showToast("warning", "Please Login First");
    return false;
  }
}

export function toggleWishList(productId, icon) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter((id) => id !== productId);
    icon.classList.remove("active", "fa-solid");
    icon.classList.add("fa-regular");
    showToast("error", "Removed from wishlist!");
  } else {
    wishlist.push(productId);
    icon.classList.add("active", "fa-solid");
    icon.classList.remove("fa-regular");
    showToast("success", "Added to wishlist");
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

export function search(title, parent) {
  const search = document.getElementById("navSearch");
  const searchBtn = document.getElementById("searchBtn");
  const list = document.getElementsByClassName(title);
  const options = document.getElementById("productSuggestions").options;
  search.addEventListener("input", (e) => {
    const value = e.target.value;
    for (let i = 0; i < list.length; i++) {
      const columnParent = list[i].closest(parent);
      list[i].innerText.toLowerCase().includes(value.toLowerCase())
        ? (columnParent.style.display = "block")
        : (columnParent.style.display = "none");
    }
  });
  searchBtn.addEventListener("click", (e) => {
    let foundOption = null;
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === search.value) {
        foundOption = options[i];
        break;
      }
    }
    if (foundOption) {
      open(foundOption.dataset.link, "_blank");
    }
  });
}

export function filterProductsByStoredCategory() {
  let category = localStorage.getItem("category");
  if (category) {
    const productCategories =
      document.getElementsByClassName("product__category");
    let anyMatches = false;

    for (let categoryElement of productCategories) {
      const productCard = categoryElement.closest(".col-md-4");
      if (!productCard) continue;
      const elementText = categoryElement.dataset.category.toLowerCase();
      const matchesCategory = elementText.includes(category.toLowerCase());
      productCard.style.display = matchesCategory ? "block" : "none";
      if (matchesCategory) anyMatches = true;
      localStorage.removeItem("category");
    }
    if (!anyMatches) {
      showToast("error", "this product does not exist in the stock right now");
      document.getElementById("product-container").textContent =
        "No products found.";
    }
    return;
  }
}

export function redirectToNotFoundPage(condition) {
  if (condition) {
    window.location.href = "/404.html";
  }
}

export function loggout() {
  localStorage.removeItem("token");
  const users = JSON.parse(localStorage.getItem("users") || []);
  const updatedUsers = users.map((user) => {
    const { token, ...rest } = user;
    return rest;
  });
  localStorage.setItem("users", JSON.stringify(updatedUsers));
  window.location.href = "/customer/products/products.html";
}
