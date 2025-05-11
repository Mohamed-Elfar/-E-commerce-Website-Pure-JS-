class ExclusiveFooter extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <footer class="footer bg-black text-white mt-5 position-relative">
      <div class="container py-5">
        <div class="outer__grid d-flex flex-wrap gap-3 mx-4 mx-md-0">
          <div class="col">
            <h3 class="fw-bold mb-2">exclusive</h3>
            <ul class="nav flex-column text--secondary">
              <li class="nav-item"><h5>subscribe</h5></li>
              <li class="nav-item mb-2">
                <p class="m-1">Get 10% off your first order</p>
                <input
                  type="email"
                  class="form-control w-75"
                  placeholder="Enter Your Email"
                />
              </li>
            </ul>
          </div>
          <div class="col">
            <h5 class="mb-2">support</h5>
            <ul class="nav flex-column text--secondary">
              <li class="nav-item mb-2 w-75">
                111 Bijoy Sarani, Dhaka, DH 1515, Bangladesh.
              </li>
              <li class="nav-item mb-2">
                <a href="mailto:exclusive@gmailcom" class="border-0"
                  >exclusive@gmail.com
                </a>
              </li>
              <li class="nav-item mb-2">
                <a href="tel:+8801588889999" class="border-0"
                  >+88015-88888-9999
                </a>
              </li>
            </ul>
          </div>
          <div class="col">
            <h5 class="mb-2">Account</h5>
            <ul class="nav flex-column text--secondary">
              <li class="nav-item mb-2">
                <a href="/customer/profile/profile.html" class="border-0">my account</a>
              </li>
              <li class="nav-item mb-2">
                <a href="/customer/cart/cart.html" class="border-0">cart</a>
              </li>
              <li class="nav-item mb-2">
                <a href="/customer/wishlist/wishlist.html" class="border-0"
                  >wishlist</a
                >
              </li>
              <li class="nav-item mb-2">
                <a href="/customer/products/products.html" class="border-0"
                  >shop</a
                >
              </li>
            </ul>
          </div>
          <div class="col">
            <h5 class="mb-2">quick links</h5>
            <ul class="nav flex-column text--secondary">
              <li class="nav-item mb-2">
                <a href="#" class="border-0">privacy policy</a>
              </li>
              <li class="nav-item mb-2">
                <a href="#" class="border-0">terms & conditions</a>
              </li>
              <li class="nav-item mb-2">
                <a href="#" class="border-0">FAQ</a>
              </li>
              <li class="nav-item mb-2">
                <a href="/customer/contact/contact.html" class="border-0"
                  >contact</a
                >
              </li>
            </ul>
          </div>
          <div class="col">
            <h5 class="mb-2">download app</h5>
            <ul class="nav flex-column text--secondary">
              <li class="nav-item mb-2">
                <a href="#" class="border-0 mb-2"
                  >save $3 with app new user only</a
                >
                <div class="d-flex place-items-center">
                  <div class="footer__barcode">
                    <img
                      src="/assets/images/footer/Qrcode 1.png"
                      alt="barcode img fot footer"
                    />
                  </div>
                  <div class="d-flex flex-column mx-4">
                    <img
                      src="/assets/images/footer/png-transparent-google-play-store-logo-google-play-app-store-android-wallets-text-label-logo.png"
                      alt="google play icon"
                    />
                    <img
                      src="/assets/images/footer/download-appstore.png"
                      alt="app store icon"
                    />
                  </div>
                </div>
              </li>
              <li class="nav-item mb-2">
                <div class="d-flex gap-5 fs-5 my-2">
                  <a href="https:
                  <a href="https:
                  <a href="https:
                  <a href="https:
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer__rights">
        <p class="text--secondary border-top text-center m-auto py-3">
          copyright &copy; 2022 exclusive. all rights reserved
        </p>
      </div>
      <button id="scrollToTopBtn" class="btn btn-dark rounded-circle position-absolute end-0" title="Scroll to top">
        <i class="fas fa-arrow-up"></i>
      </button>
    </footer>
    `;
    this.querySelector("#scrollToTopBtn").addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

customElements.define("exclusive-footer", ExclusiveFooter);
