class SectionHeaderComponent extends HTMLElement {
    connectedCallback() {
        const section_title = this.getAttribute('title');
        const section_pin = this.getAttribute('pin');
        const section_type = this.getAttribute('type');

        this.innerHTML = `
            <h6 class="section__pin section__pin-alt mb-4">${section_pin}</h6>
            <div class="section__header">
                <div class="section__highlights">
                    <p class="section__title">${section_title}</p>
                    <a href= "/customer/all_products/all_products.html?type=${section_type}" class="section__button background-primary secondary-color" id="viewallBtn">
                        View All    
                    </a>
                </div>
            </div>
      `;

        // Product categories button special case
        if (this.hasAttribute('noviewallBtn')) this.querySelector('#viewallBtn').style.display = 'none'
    }
}
customElements.define('section-header', SectionHeaderComponent);