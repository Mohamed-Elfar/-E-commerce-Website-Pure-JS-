class SectionHeaderComponent extends HTMLElement {
    connectedCallback() {
        const section_title = this.getAttribute('title');
        const section_pin = this.getAttribute('pin');

        this.innerHTML = `
            <link rel="stylesheet" href="/assets/css/fontawesome.min.css">
            <link rel="stylesheet" href="/assets/css/style.css">
            <link rel="stylesheet" href="/customer/home/home.css">
            <link rel="stylesheet" href="/assets/css/bootstrap.min.css">
            <h6 class="section__pin section__pin__alt mb-4">${section_pin}</h6>
            <div class="section__header">
                <div class="section__highlights">
                    <p class="section__title">${section_title}</p>
                    <button class="section__button background-primary secondary-color" type="button" id="viewallBtn">View All</button>
                </div>
            </div>
      `;

        // Product categories button special case
        if (this.hasAttribute('noviewallBtn')) this.querySelector('#viewallBtn').style.display = 'none'
    }
}
customElements.define('section-header', SectionHeaderComponent);