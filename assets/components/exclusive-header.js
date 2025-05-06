import { loggout } from "/assets/js/utils.js";

class ExclusiveHeader extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
<header>
  <marquee
    behavior="scroll"
    scrollamount="12"
    direction="right"
    class="w-100 bg-black text-center text--secondary py-2"
  >
    <i
      class="fa-solid fa-person-running text-white mx-5 moveAnimation fs-5"
    ></i>
    summer sale for all swim suits and free express delivery-
    <span class="text-uppercase">OFF</span> 50%! &nbsp;
    <a href="#" class="text-white border-white"> shop now</a>
    <i class="fa-solid fa-basket-shopping ms-2 fa-bounce text-white"></i>
  </marquee>

  <nav class="navbar navbar-expand-lg navbar-light border-bottom">
    <div class="container">
      <a class="navbar-brand fw-bold border-0 fs-5" href="#">exclusive</a>
      <button class="navbar-toggler" type="button" id="navbarToggler">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav m-auto mb-2 mb-lg-0 text-center">
          <li class="nav-item">
            <a class="nav-link active" href="/customer/home/home.html">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/customer/contact/contact.html"
              >contact</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/customer/about/about.html">about</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/customer/products/products.html"
              >products</a
            >
          </li>
        </ul>
        <form class="d-flex column-gap-1" id="searchForm">
          <div class="input-group">
            <input
              type="search"
              class="form-control border-end-0 no-outline"
              placeholder="what are you looking for?"
              aria-label="Search"
              id="navSearch"
            />
            <button
              id="searchBtn"
              class="input-group-text bg-white"
              type="button"
            >
              <i class="fa fa-search"></i>
            </button>
          </div>
          <datalist id="productSuggestions">
            <option
              value="login"
              data-link="/authentication/login.html"
            ></option>
            <option
              value="register"
              data-link="/authentication/register.html"
            ></option>
          </datalist>
          <a class="btn" id="wishlistLink" href="/customer/wishlist/wishlist.html">
            <i class="fa fa-heart"></i>
            <span class="badge" id="wishlistCount">3</span>
          </a>

          <a class="btn" id="cartLink" href="/customer/cart/cart.html">
            <i class="fa fa-shopping-cart"></i>
            <span class="badge" id="cartCount">5</span>
          </a>
          <a
            class="btn bg-black text-white"
            id="loginBtn"
            href="/authentication/login.html"
            type="button"
          >
            Login
          </a>
          <a
            class="btn btn--primary text-white"
            id="registerBtn"
            href="/authentication/register.html"
            type="button"
          >
            signUp
          </a>
          <div class="btn-group">
            <button
              class="btn userIcon  border-0 rounded-circle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="fa-regular fa-user" aria-hidden="true"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end bg-muted">
              <li class="d-flex align-items-center mx-3 d-none" id="adminLink">
                <i class="fa fa-regular fa-user"></i>
                <a class="dropdown-item text-white" href="/admin/dashboard.html"
                  >Dashboard</a
                >
              </li>
              <li
                class="d-flex align-items-center mx-3 d-none"
                id="serllerLink"
              >
                <i class="fa fa-regular fa-user"></i>
                <a
                  class="dropdown-item text-white"
                  href="/seller/dashboard.html"
                  >Dashboard</a
                >
              </li>
              <li class="d-flex align-items-center mx-3">
                <i class="fa fa-regular fa-user"></i>
                <a
                  class="dropdown-item text-white"
                  href="/customer/profile/profile.html"
                  >My Account</a
                >
              </li>
              <li class="d-flex align-items-center mx-3">
                <i class="fa-regular fa-heart"></i>
                <a
                  class="dropdown-item text-white"
                  href="/customer/profile/profile.html"
                  >Manage Wishlist</a
                >
              </li>
              <li class="d-flex align-items-center mx-3">
                <i class="fa-solid fa-bag-shopping"></i>
                <a
                  class="dropdown-item text-white"
                  href="/customer/profile/profile.html"
                  >Manage Orders</a
                >
              </li>
              <li class="d-flex align-items-center mx-3">
                <i class="fa-solid fa-ban"></i>
                <a
                  class="dropdown-item text-white"
                  href="/customer/profile/profile.html"
                  >Manage Cancellations</a
                >
              </li>
              <li class="d-flex align-items-center mx-3">
                <i class="fa fa-sign-out"></i>
                <a class="dropdown-item text-white" href="#" id="logoutBtn"
                  >Logout</a
                >
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  </nav>
</header>

    `;
  }

  connectedCallback() {
    this.initBootstrapToggle();
    this.loggedInUser();
    this.initDropdown();
    this.setupLogout();
    this.badges();
  }

  initBootstrapToggle() {
    const toggler = this.querySelector("#navbarToggler");
    const collapse = this.querySelector("#navbarSupportedContent");

    if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
      const bsCollapse = new bootstrap.Collapse(collapse, {
        toggle: false,
      });

      toggler.addEventListener("click", () => {
        bsCollapse.toggle();
      });
    } else {
      toggler.addEventListener("click", () => {
        collapse.classList.toggle("show");
      });
    }
  }
  badges() {
    const wishlistCount = this.querySelector("#wishlistCount");
    const cartCount = this.querySelector("#cartCount");
    if (wishlistCount) {
      const wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
      wishlistCount.textContent = wishlistItems.length || 0;
    }
    if (cartCount) {
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      cartCount.textContent = cartItems.length || 0;
    }
  }
  loggedInUser() {
    const token = localStorage.getItem("token");
    const userButton = this.querySelector(".userIcon");
    const adminLink = this.querySelector("#adminLink");
    const serllerLink = this.querySelector("#serllerLink");
    const wishlistLink = this.querySelector("#wishlistLink");
    const cartLink = this.querySelector("#cartLink");
    const loginBtn = this.querySelector("#loginBtn");
    const registerBtn = this.querySelector("#registerBtn");
    if (adminLink) {
      const users = JSON.parse(localStorage.getItem("users"));
      const user = users.find((user) => user.token === token);
      if (user) {
        user.role === "Admin"
          ? adminLink.classList.remove("d-none")
          : adminLink.classList.add("d-none");
        user.role === "Seller"
          ? serllerLink.classList.remove("d-none")
          : serllerLink.classList.add("d-none");
        console.log(user.role);
      }
    }

    if (!token) {
      if (userButton) userButton.classList.add("d-none");
      if (wishlistLink) wishlistLink.classList.add("d-none");
      if (cartLink) cartLink.classList.add("d-none");

      if (loginBtn) loginBtn.classList.remove("d-none");
      if (registerBtn) registerBtn.classList.remove("d-none");
    } else {
      if (userButton) {
        userButton.classList.remove("d-none");
        userButton.addEventListener("click", () => {
          userButton.classList.toggle("userIcon--Style");
        });
      }
      if (wishlistLink) wishlistLink.classList.remove("d-none");
      if (cartLink) cartLink.classList.remove("d-none");

      if (loginBtn) loginBtn.classList.add("d-none");
      if (registerBtn) registerBtn.classList.add("d-none");
    }
  }
  initDropdown() {
    const userButton = this.querySelector(".userIcon");
    if (userButton && typeof bootstrap !== "undefined" && bootstrap.Dropdown) {
      new bootstrap.Dropdown(userButton);
    }
  }
  setupLogout() {
    const logoutBtn = this.querySelector("#logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        loggout();
      });
    }
  }
}

customElements.define("exclusive-header", ExclusiveHeader);
