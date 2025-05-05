class ProductCardComponent extends HTMLElement {
    constructor() {
        super();
        this.hasConnected = false; // Flag to check if connectedCallback has been called
    }
    connectedCallback() {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        let isAddToWishlist = wishlist.includes(this.getAttribute('id'));
        
        this.innerHTML = `
            <link rel="stylesheet" href="/customer/home/home.css">
            <div class="product mt-3 w-100">
                <div class="product__badge position-relative overflow-hidden rounded mb-3">
                    <div class="product__actions d-flex position-absolute justify-content-between w-100 p-3">
                        <div id="productDiscount" class="product__discount py-1 px-3 secondary-color background-primary rounded text-center position-absolute left-1 top-1"></div>
                        <div class="product__icons d-flex flex-column position-absolute gap-1">
                            <div class="product__icon-container"><i class="product__icon ${isAddToWishlist ? "text-danger fa-solid" : "fa-regular"} fa-heart"></i></div>
                            <a href="#"><div class="product__icon-container"><i class="product__icon fa-regular fa-eye"></i></div></a>
                        </div>
                    </div>
                    <img id="productImage" class="product__image position-absolute top-50 start-50" src="" alt="">
                    
                    <div class="product__overlay bg-black secondary-color d-none position-absolute w-100 start-50 translate-middle-x text-center bottom-0 fw-medium rounded-bottom">
                        Add To Cart
                    </div>
                </div>
                <h6 id="productName" class="product__title mb-2"></h6>
                <div class="product__price d-flex gap-2 mt-2">
                    <h6 id="productPrice" class="product__price-new primary-color">$</h6>
                    <p id="productOldPrice" class="product__price-old text-decoration-line-through opacity-50"></p>
                </div>
                <div class="product__rating mb-3">
                    <div id="productRatingStar"></div>
                    <p id="productRatingCount" class="product__rating-count fw-semibold opacity-50"></p>
                </div>
            </div>
            `;
        this.hasConnected = true;


        // After rendering, apply attributes
        ['name', 'price', 'image', 'rating', 'ratingCount', 'sale', 'category', 'id'].forEach(attr => {
            if (this.hasAttribute(attr)) {
                this.attributeChangedCallback(attr, null, this.getAttribute(attr));
            }
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // Wait until DOM is rendered
        if (!this.hasConnected) return;

        switch (name) {
            case 'name':
                this.querySelector('#productName')
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
            case 'price':
                this.querySelector('#productPrice')
                    .textContent += newValue;
                break;
            case 'sale':
                const saleBox = this.querySelector('#productDiscount');
                const oldPriceBox = this.querySelector('#productOldPrice');
                const newPriceBox = this.querySelector('#productPrice');

                if (newValue !== "") {
                    saleBox.style.display = "block";
                    oldPriceBox.style.display = "block";
                    saleBox.innerText = `-${newValue}`;

                    //set the existing price as an old price
                    let currentPrice = newPriceBox.innerText;
                    oldPriceBox.innerText = currentPrice;

                    //extract the numbers
                    const oldPriceText = currentPrice.replace(/[^0-9.]/g, '');
                    const saleText = newValue.replace(/[^0-9.]/g, '');

                    //calculate the new price
                    newPriceBox.innerText = `$${(parseFloat(oldPriceText) * (1 - parseFloat(saleText) / 100)).toFixed(2)}`;
                }
                break;
            case 'rating':
                let ratingBox = this.querySelector('#productRatingStar');
                ratingBox.innerHTML =
                    `${[...Array(5)]
                        .map((_, i) =>
                            `<i class="product__rating-star ${i < newValue ? "fa-solid" : "fa-regular"} fa-star"></i>`
                        ).join("")}`;
                break;
        }
    }
}
customElements.define('product-card', ProductCardComponent);