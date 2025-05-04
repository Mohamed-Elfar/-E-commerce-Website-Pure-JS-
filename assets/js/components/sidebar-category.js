class SidebarCategoryComponent extends HTMLElement {
    connectedCallback() {
        const category = this.getAttribute('category');

        this.innerHTML = `
            <a href="/customer/all_products/all_products.html?type=${category}" class="nav-item nav-link"  id="sidebarCategory">
              ${category}
            </a>
        `;
    }
}

customElements.define('sidebar-category', SidebarCategoryComponent);