class SideBarComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
             <div class="sidebar col-md-3 col-lg-2 d-md-block">
                <div class="position-sticky pt-3">
                    <div class="text-center mb-4">
                        <h4>Exclusive</h4>
                        <hr class="bg-light">
                    </div>
                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <a class="nav-link" href="dashboard.html">
                                <i class="fas fa-tachometer-alt"></i> Dashboard
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="manage-products.html">
                                <i class="fas fa-box-open"></i> Products
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="orders.html">
                                <i class="fas fa-shopping-cart"></i> Orders
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="analytics.html">
                                <i class="fas fa-chart-line"></i> Analytics
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">
                                <i class="fas fa-tags"></i> Discounts
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">
                                <i class="fas fa-cog"></i> Settings
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        `;

        const currentPage = window.location.pathname.split('/').pop();
        const menuLinks = this.querySelectorAll('.nav-link');
        
        menuLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }
}

customElements.define('side-bar', SideBarComponent);