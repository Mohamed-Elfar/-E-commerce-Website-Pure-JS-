class SidebarCategoryComponent extends HTMLElement {
    connectedCallback() {
        const category = this.getAttribute('category');
        this.innerHTML = `
            <a href="/customer/all_products/all_products.html" class="nav-item nav-link" id="sidebarCategory">
              ${category}
            </a>
        `;

        this.querySelector('#sidebarCategory').addEventListener('click', (e) => {
            window.setCategory(category);
        });
    }
}

customElements.define('sidebar-category', SidebarCategoryComponent);