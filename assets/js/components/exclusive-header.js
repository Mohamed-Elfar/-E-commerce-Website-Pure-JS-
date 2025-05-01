class ExclusiveHeader extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <header>
        <p class="w-100 bg-black text-center .text--secondary py-2">
          summer sale for all swim suits and free express delivery-
          <span class="text-uppercase">OFF</span> 50%! &nbsp;
          <a href="#" class="text-white border-white"> shop now</a>
        </p>
        <nav class="navbar navbar-expand-lg navbar-light border-bottom">
          <div class="container">
            <a class="navbar-brand fw-bold border-0 fs-5" href="#">exclusive</a>
            <button class="navbar-toggler" type="button" id="navbarToggler">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav m-auto mb-2 mb-lg-0 text-center">
                <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="#">contact</a></li>
                <li class="nav-item"><a class="nav-link" href="#">about</a></li>
                <li class="nav-item"><a class="nav-link" href="#">products</a></li>
              </ul>
              <form class="d-flex column-gap-1" id="searchForm">
                <div class="input-group">
                  <input type="search" class="form-control border-end-0 no-outline"
                         placeholder="what are you looking for?" aria-label="Search"
                         id="navSearch">
                  <button id="searchBtn" class="input-group-text bg-white" type="button">
                    <i class="fa fa-search"></i>
                  </button>
                </div>
                <datalist id="productSuggestions">
                  <option value="login" data-link="./authentication/login.html"></option>
                  <option value="register" data-link="./authentication/register.html"></option>
                </datalist>
                <button class="btn" type="button"><i class="fa fa-heart"></i></button>
                <button class="btn" type="button"><i class="fa fa-shopping-cart"></i></button>
              </form>
            </div>
          </div>
        </nav>
      </header>
    `;
  }

  connectedCallback() {
    this.initBootstrapToggle();
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
}

customElements.define("exclusive-header", ExclusiveHeader);



