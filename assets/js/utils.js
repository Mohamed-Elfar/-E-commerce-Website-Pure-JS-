export function showToast(status, message) {
  const toast = document.querySelector(".toast");
  if (!toast) {
    console.error("Toast element not found in DOM");
    return;
  }

  // Reset classes
  toast.className = "toast";
  
  // Icons mapping
  const icons = {
    success: "fa-circle-check",
    error: "fa-triangle-exclamation",
    warning: "fa-warning",
    info: "fa-info"
  };

  if (!icons[status]) {
    console.error(`Invalid toast status: ${status}`);
    return;
  }

  toast.innerHTML = `<i class="fa-solid ${icons[status]}"></i> ${message}`;
  toast.classList.add("show", `toast-${status}`);

  // Auto-hide after 3 seconds
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
  var Password =
    /^(?=.[A-Z])(?=.[a-zA-Z0-9])(?=.[!@#$%^&()_+={}\[\]:;"'<>,.?/\\|`~\-]).{6,}$/;
  if (!Password.test(input.value)) {
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
      if (product.quantity > 0) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateBadges();
        showToast("success", "Product added to cart");
        return true;
      } else {
        showToast("error", "Product out of stock");
        return false;
      }
    } else {
      showToast("info", "Product is already in your cart");
      return false;
    }
  } else {
    showToast("warning", "Please Login First");
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
  updateBadges();

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
export function saveUserToLocal(userInstance) {
  try {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const newUser = userInstance.toJSON();

    if (!newUser || typeof newUser !== "object") {
      throw new Error("Invalid user data format");
    }

    if (!newUser.email || !newUser.firstName || !newUser.lastName) {
      throw new Error("Missing required user fields");
    }

    const existEmail = users.some(
      (user) => user && user.email === newUser.email
    );
    const existPhone = users.some(
      (user) => user && user.phone === newUser.phone
    );

    if (existEmail) {
      throw new Error("This email already exists");
    }
    if (existPhone) {
      throw new Error("This Phone Number already exists");
    }

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    return true;
  } catch (error) {
    console.error("Failed to save user:", error);
    showToast("error", error.message);
    throw error;
  }
}
export class User {
  static get totalUsers() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.length;
  }

  #firstName;
  #lastName;
  #email;
  #phone;
  #password;
  #sellerRadio;
  #userId;

  constructor({
    first_name,
    last_name,
    email,
    phone_number,
    password,
    want_to_be_seller,
  }) {
    if (new.target === User) {
      throw new Error(
        "User is an abstract class and cannot be instantiated directly."
      );
    }

    this.firstName = first_name;
    this.lastName = last_name;
    this.email = email;
    this.phone = phone_number;
    this.password = password;
    this.#sellerRadio = want_to_be_seller;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    this.#userId =
      users.length > 0 ? Math.max(...users.map((user) => user.userId)) + 1 : 1;

    if (typeof saveUserToLocal === "function") {
      saveUserToLocal(this);
    } else {
      throw new Error("Save functionality not available");
    }

    console.log("Created user:", this);
  }

  get userId() {
    return this.#userId;
  }
  get password() {
    return this.#password;
  }
  get firstName() {
    return this.#firstName;
  }
  get lastName() {
    return this.#lastName;
  }
  get email() {
    return this.#email;
  }
  get phone() {
    return this.#phone;
  }
  set firstName(value) {
    if (!validateName(value)) {
      showToast("error", "Invalid first Name");
      throw new Error("Validation failed for first name");
    }
    this.#firstName = value;
  }
  set lastName(value) {
    if (!validateName(value)) {
      showToast("error", "Invalid last Name");
      throw new Error("Validation failed for last name");
    }
    this.#lastName = value;
  }
  set email(value) {
    if (!validateEmail(value)) {
      showToast("error", "Invalid Email");
      throw new Error("Validation failed for email");
    }
    this.#email = value;
  }
  set phone(value) {
    if (!validatePhone(value)) {
      showToast("error", "Invalid Phone");
      throw new Error("Validation failed for phone");
    }
    this.#phone = value;
  }
  set password(value) {
    if (!validatePassword(value)) {
      showToast("error", "Invalid Password");
      throw new Error("Validation failed for password");
    }
    this.#password = hashPassword(value);
  }

  toJSON() {
    return {
      userId: this.#userId,
      firstName: this.#firstName,
      lastName: this.#lastName,
      email: this.#email,
      phone: this.#phone,
      password: this.#password,
      want_to_be_seller: this.#sellerRadio,
      role: this.constructor.name,
    };
  }

  print() {
    console.log(`User ID: ${this.#userId}`);
  }
}

export function loginUser() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const token = localStorage.getItem("token") || [];
  const user = users.find((user) => user.token === token);
  return user;
}

 