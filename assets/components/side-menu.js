class SideMenuComponent extends HTMLElement {
  connectedCallback() {
    const href1 = this.getAttribute("href-1") || "dashboard.html";
    const href2 = this.getAttribute("href-2") || "products-management.html";
    const href3 = this.getAttribute("href-3") || "orders.html";
    const href4 = this.getAttribute("href-4") || "analytics.html";

    this.innerHTML = `
        <style>
            .sidemenu{
                position: fixed;
                z-index: 1040;
                left: -250px;
                background-color: #2c3e50 !important;
                color: white;
                height: 100vh;
                height: 100vh;
                top: 0;
                padding-top: 10px;
                transition: left 0.3s ease;
                border-radius: 0px 10px 10px 0px;
            }

            .sidemenu .nav-link {
                color: rgba(255, 255, 255, 0.8);
                border-left: 3px solid transparent;
                padding: 10px 15px;
                margin-bottom: 5px;
            }

            .sidemenu .nav-link:hover,
            .sidemenu .nav-link.active {
                color: white;
                background-color: rgba(255, 255, 255, 0.1);
                border-left: 3px solid var(--color-primary);
            }

            .sidemenu .nav-link i {
                margin-right: 10px;
            }

            .sidemenu-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1039;
                opacity: 0;
                visibility: hidden;
            }

            .sidemenu.show {
                left: 0;
            }

            .sidemenu-backdrop.show {
                opacity: 1;
                visibility: visible;
            }


            @media (min-width: 992px) {
                .sidemenu {
                    background-color: white;
                    position: fixed;
                    left: 0;
                }

                .sidemenu .nav-link {
                    color: var(--color-black) !important;
                }

                .sidemenu-backdrop {
                    display: none !important;
                }

                .sidemenu .nav-link:hover {
                    background-color: rgba(0, 0, 0, 0.1);
                }
            }

            .toggle-btn {
                position:static;
                padding-inline: 15px;
                background-color: #2c3e50;
                color: white;
                font-size: 22px;
                transition: all 0.4s ease;
            }

            .toggle-btn:hover ,.toggle-btn.active{
                background-color: #34495e;
                color: white;
            }
        </style>
        <div class="sidemenu-backdrop"></div>
        <div class="col-6 col-md-3 col-lg-2 sidemenu collapse p-0" id="sidemenu">
            <div class="nav flex-column">
                <div class="text-center my-4">
                    <h4>Exclusive</h4>
                    <hr class="bg-light">
                </div>
                <a class="nav-link nav-item" href="${href1}">
                    <i class="fas fa-tachometer-alt"></i> Dashboard
                </a>
                <a class="nav-link nav-item" href="${href2}">
                    <i class="fas fa-box-open"></i> Products
                </a>
                <a class="nav-link nav-item" href="${href3}">
                    <i class="fas fa-shopping-cart"></i> Orders
                </a>
                <a class="nav-link nav-item" href="${href4}">
                    <i class="fas fa-chart-line"></i> Analytics
                </a>
                <a class="nav-link nav-item" href="#">
                    <i class="fas fa-tags"></i> Discounts
                </a>
                <a class="nav-link nav-item" href="#">
                    <i class="fas fa-cog"></i> Settings
                </a>
            </div>
        </div>
        `;

    const currentPage = window.location.pathname.split("/").pop();
    const menuLinks = this.querySelectorAll(".nav-link");

    menuLinks.forEach((link) => {
      if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
      }
    });

    const sidemenu = document.getElementById("sidemenu");
    const backdrop = document.querySelector(".sidemenu-backdrop");

    sidemenu.addEventListener("show.bs.collapse", () => {
      backdrop.classList.add("show");
      document.addEventListener("click", closeOnClickOutside);
    });

    sidemenu.addEventListener("hide.bs.collapse", () => {
      backdrop.classList.remove("show");
      document.removeEventListener("click", closeOnClickOutside);
    });

    backdrop.addEventListener("click", () => {
      new bootstrap.Collapse(sidemenu).hide();
    });

    function closeOnClickOutside(event) {
      if (
        !sidemenu.contains(event.target) &&
        !document
          .querySelector(
            '[data-bs-toggle="collapse"][data-bs-target="#sidemenu"]'
          )
          .contains(event.target)
      ) {
        new bootstrap.Collapse(sidemenu).hide();
      }
    }
  }
}

customElements.define("side-menu", SideMenuComponent);
