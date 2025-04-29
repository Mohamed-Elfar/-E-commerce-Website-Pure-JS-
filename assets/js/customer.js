class SectionHeaderComponent extends HTMLElement {

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <link rel="stylesheet" href="/assets/css/fontawesome.min.css">
            <link rel="stylesheet" href="/assets/css/style.css">
            <link rel="stylesheet" href="/customer/home/home.css">
            <div class="section__header">
                <div class="section__pin">
                    <div class="section__pin-icon"></div>
                    <p class="section__pin-text">Today's</p>
                </div>
                <div class="section__title-controls">
                    <p class="section__title">Flash Sales</p>
                    <div class="section__controls">
                        <div class="section__arrow-container">
                            <i class="section__arrow fa-solid fa-arrow-left"></i>
                        </div>
                        <div class="section__arrow-container">
                            <i class="section__arrow fa-solid fa-arrow-right"></i>
                        </div>
                    </div>
                </div>
            </div>
      `;
    }
}
customElements.define('section-header', SectionHeaderComponent);

class ProductCardComponent extends HTMLElement {
    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });

        shadow.innerHTML = `
            <link rel="stylesheet" href="/assets/css/fontawesome.min.css">
            <link rel="stylesheet" href="/assets/css/style.css">
            <link rel="stylesheet" href="/customer/home/home.css">
            <div class="product">
                <div class="product__badge">
                    <div class="product__actions">
                        <div id="discount"></div>
                        <div class="product__icons">
                            <a href="#">
                                <div class="product__icon-container">
                                    <i class="product__icon fa-regular fa-heart"></i>
                                </div>
                            </a>
                            <a href="#">
                                <div class="product__icon-container">
                                    <i class="product__icon fa-regular fa-eye"></i>
                                </div>
                            </a>
                        </div>
                    </div>
                    <img class="product__image" src="/assets/images/g92.png" alt="G92">
                    <a href="#">
                    <div class="product__overlay">Add To Cart</div>
                    </a>
                </div>
                <p class="product__title">HAVIT HV-G92 Gamepad</p>
                <div class="product__price">
                    <p class="product__price-new">$120</p>
                    <p class="product__price-old">$160</p>
                </div>
                <div class="product__rating">
                    <div>
                    <i class="product__rating-star fa-solid fa-star"></i>
                    <i class="product__rating-star fa-solid fa-star"></i>
                    <i class="product__rating-star fa-solid fa-star"></i>
                    <i class="product__rating-star fa-solid fa-star"></i>
                    <i class="product__rating-star fa-regular fa-star"></i>
                    </div>
                    <p class="product__rating-count">(88)</p>
                </div>
            </div>
      `;

        // product discount special case
        const productDiscount = shadow.getElementById('discount');
        if (this.hasAttribute('discount')) {
            productDiscount.classList.add('product__discount');
            productDiscount.textContent = '-40%';
        }
    }
}
customElements.define('product-card', ProductCardComponent);