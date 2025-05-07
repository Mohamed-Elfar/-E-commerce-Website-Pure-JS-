import { addToCart, toggleWishList } from "/assets/js/utils.js";
import { redirectToNotFoundPage } from "/assets/js/utils.js";

export function creatProductCard(product) {
    const productCard = document.createElement('product-card');
    productCard.className = 'col-12 col-sm-6 col-md-5 col-xl-3';
    productCard.setAttribute('name', product.name || 'Unknown Product');
    productCard.setAttribute('price', product.price || '0.00');
    productCard.setAttribute('image', product.image || '');
    productCard.setAttribute('rating', product.rating || '0');
    productCard.setAttribute('ratingCount', `(${product.ratingCount})` || '0');
    productCard.setAttribute('sale', product.sale || '');
    productCard.addEventListener('click', function (e) {
        if (e.target.closest('.product__overlay')) {
            addToCart(product);
        }
    });
    productCard.setAttribute('id', product.id || '');
    productCard.addEventListener('click', function (e) {
        let wishIcon = e.target.closest('.fa-heart');
        if (wishIcon) {
            toggleWishList(product.id.toString(), wishIcon);
        }
    });
    return productCard;
}

export function fetchResponse() {
    const storedProducts = localStorage.getItem("allProducts");

    if (storedProducts) {
        return Promise.resolve(JSON.parse(storedProducts));
    }

    return fetch('/assets/data/products.json')
        .then(response => response.json())
        .then(products => {
            localStorage.setItem("allProducts", JSON.stringify(products));
            return products;
        }).catch(() => redirectToNotFoundPage(true));
}