import { addToCart, search, toggleWishList, redirectToNotFoundPage } from "/assets/js/utils.js";
import { creatProductCard, fetchResponse } from "/assets/js/main.js";

const productsTitle = document.getElementById('products-title');
const productsSection = document.getElementById('products-section');
const validCategories = ['Smartphones', 'Tablets', 'Laptops', 'Gaming', 'SmartWatches', 'HeadPhones'];

function clearAndSetTitle(title) {
    productsTitle.textContent = title;
    productsSection.innerHTML = '';
}

export function fetchAllProducts() {
    clearAndSetTitle("All Products");
    fetchResponse().then(products => {
        products.forEach(product => {
            productsSection.appendChild(creatProductCard(product));
        });
    }).catch(() => redirectToNotFoundPage(true));
};

export function fetchBestSellingProducts() {
    clearAndSetTitle("Best Selling");
    fetchResponse().then(products => {
        products.sort((a, b) => (b.ratingCount || 0) - (a.ratingCount || 0)).slice(0, 20).forEach(product => {
            productsSection.appendChild(creatProductCard(product));
        });
    }).catch(() => redirectToNotFoundPage(true));
};

export function fetchFlashSalesProducts() {
    clearAndSetTitle("Flash Sales");
    fetchResponse().then(products => {
        products.filter(
            product => product.sale != null && product.sale !== ''
        ).sort(() => Math.random() - 0.5).forEach(product => {
            productsSection.appendChild(creatProductCard(product));
        });
    }).catch(() => redirectToNotFoundPage(true));
};

export function fetchCategoryProducts(category) {
    clearAndSetTitle(category);
    fetchResponse().then(products => {
        products.filter(product => {
            return (
                product.category &&
                product.category.toLowerCase() === category.toLowerCase()
            );
        }).forEach(product => {
            productsSection.appendChild(creatProductCard(product));
        });
    }).catch(() => redirectToNotFoundPage(true));
}

search("product__title", ".product__card");


const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get('type');
switch (type) {
    case 'flash-sales':
        fetchFlashSalesProducts();
        break;
    case 'best-selling':
        fetchBestSellingProducts();
        break;
    case 'all-products':
        fetchAllProducts();
        break;
    default:
        if (validCategories.includes(type)) {
            fetchCategoryProducts(type);
        } else {
            clearAndSetTitle("Products");
            productsSection.innerHTML = '<p>No products selected.</p>';
        }
}
