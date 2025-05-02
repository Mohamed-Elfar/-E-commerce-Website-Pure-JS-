class ProductCardComponent extends HTMLElement {
    constructor() {
        super();
        this.hasConnected = false; // Flag to check if connectedCallback has been called
    }
    connectedCallback() {
        this.innerHTML = `
            <link rel="stylesheet" href="/assets/css/fontawesome.min.css">
            <link rel="stylesheet" href="/assets/css/style.css">
            <link rel="stylesheet" href="/customer/home/home.css">
            <div class="product">
                <div class="product__badge">
                    <div class="product__actions">
                        <div id="productDiscount" class="product__discount product__discount--hidden"></div>
                        <div class="product__icons">
                            <a href="#"><div class="product__icon-container"><i class="product__icon fa-regular fa-heart"></i></div></a>
                            <a href="#"><div class="product__icon-container"><i class="product__icon fa-regular fa-eye"></i></div></a>
                        </div>
                    </div>
                    <img id="productImage" class="product__image" src="" alt="">
                    <a href="#"><div class="product__overlay bg-black secondary-color">Add To Cart</div></a>
                </div>
                <h6 id="productName" class="product__title"></h6>
                <div class="product__price">
                    <h6 id="productPrice" class="product__price-new color-primary"></h6>
                    <p id="productOldPrice" class="product__price-old">$160</p>
                </div>
                <div class="product__rating">
                    <div>
                        <i class="product__rating-star fa-solid fa-star"></i>
                        <i class="product__rating-star fa-solid fa-star"></i>
                        <i class="product__rating-star fa-solid fa-star"></i>
                        <i class="product__rating-star fa-solid fa-star"></i>
                        <i class="product__rating-star fa-regular fa-star"></i>
                    </div>
                    <p id="productRatingCount" class="product__rating-count"></p>
                </div>
            </div>
            `;
        this.hasConnected = true;


        // After rendering, apply attributes
        ['name', 'price', 'image', 'ratingCount'].forEach(attr => {
            if (this.hasAttribute(attr)) {
                this.attributeChangedCallback(attr, null, this.getAttribute(attr));
            }
        });
    }

    static get observedAttributes() { return ['image', 'name', 'price', 'ratingCount', 'discount']; }

    attributeChangedCallback(name, oldValue, newValue) {
        // Wait until DOM is rendered
        if (!this.hasConnected) return;

        switch (name) {
            case 'name':
                this.querySelector('#productName')
                    .textContent = newValue;
                break;
            case 'price':
                this.querySelector('#productPrice')
                    .textContent = newValue;
                break;
            case 'ratingCount':
                this.querySelector('#productRatingCount')
                    .textContent = newValue;
                break;
            case 'image':
                this.querySelector('#productImage')
                    .setAttribute('src', newValue);
                break;
            case 'discount':
                const el = this.querySelector('#productDiscount');
                if (el) {
                    el.classList.remove('product__discount--hidden');
                    el.classList.add('background-primary', 'secondary-color');
                    el.textContent = newValue;
                }
                break;
        }
    }
}
customElements.define('product-card', ProductCardComponent);