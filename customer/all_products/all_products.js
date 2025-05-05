import { addToCart, search, toggleWishList, } from "/assets/js/utils.js";

export function fetchAllProducts() {
    var productsTitle = document.getElementById('products-title');
    var productsSection = document.getElementById('products-section');
    productsTitle.textContent = "All Products";
    productsSection.innerHTML = '';

    fetch('/assets/data/products.json')
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                var productCard = document.createElement('product-card');
                productCard.className = 'product__card col-12 col-sm-6 col-md-5 col-xl-3';
                productCard.setAttribute('name', product.name || 'Unknown Product');
                productCard.setAttribute('price', product.price || '0.00');
                productCard.setAttribute('image', product.image || '');
                productCard.setAttribute('rating', product.rating || '0');
                productCard.setAttribute('ratingCount', `(${product.ratingCount})` || '0');
                productCard.setAttribute('sale', product.sale || '');
                productCard.setAttribute('category', product.category || '');
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
                productsSection.appendChild(productCard);
            });
        })
        .catch(error => console.error('Error loading JSON:', error));
};
// fetchAllProducts();

export function fetchBestSellingProducts() {
    var productsTitle = document.getElementById('products-title');
    var productsSection = document.getElementById('products-section');
    productsTitle.textContent = "Best Selling";
    productsSection.innerHTML = '';

    fetch('/assets/data/products.json')
        .then(response => response.json())
        .then(products => {
            products.sort((a, b) => (b.ratingCount || 0) - (a.ratingCount || 0)).slice(0, 20).forEach(product => {
                var productCard = document.createElement('product-card');
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
                productsSection.appendChild(productCard);
            });
        })
        .catch(error => console.error('Error loading products:', error));
};
// fetchBestSellingProducts();

export function fetchFlashSalesProducts() {
    var productsTitle = document.getElementById('products-title');
    var productsSection = document.getElementById('products-section');
    productsTitle.textContent = "Flash Sales";
    productsSection.innerHTML = '';

    fetch('/assets/data/products.json')
        .then(response => response.json())
        .then(products => {
            products.filter(
                product => product.sale != null && product.sale !== ''
            ).sort(() => Math.random() - 0.5).forEach(product => {
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
                productsSection.appendChild(productCard);
            });
        })
        .catch(error => console.error('Error loading products:', error));
};
// fetchFlashSalesProducts();

export function fetchCategoryProducts(category) {
    const productsTitle = document.getElementById('products-title');
    const productsSection = document.getElementById('products-section');
    productsTitle.textContent = category;
    productsSection.innerHTML = '';

    fetch('/assets/data/products.json')
        .then(response => response.json())
        .then(products => {
            products.filter(product => {
                return (
                    product.category &&
                    product.category.toLowerCase() === category.toLowerCase()
                );
            }).forEach(product => {
                const productCard = document.createElement('product-card');
                productCard.className = 'col-12 col-sm-6 col-md-5 col-xl-3';
                productCard.setAttribute('name', product.name || 'Unknown Product');
                productCard.setAttribute('price', product.price || '0.00');
                productCard.setAttribute('image', product.image || '');
                productCard.setAttribute('rating', product.rating || '0');
                productCard.setAttribute('ratingCount', `(${product.ratingCount || 0})`);
                productCard.setAttribute('sale', product.sale || '');
                productCard.setAttribute('category', product.category || '');
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
                productsSection.appendChild(productCard);
            });
        })
        .catch(error => {
            console.error('Error loading products:', error);
            productsSection.innerHTML = '<p>Error loading products. Please try again later.</p>';
        });
}

search("product__title", ".product__card");


const validCategories = [
    'Smartphones',
    'Tablets',
    'Laptops',
    'Gaming',
    'SmartWatches',
    'HeadPhones'
];

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
            document.getElementById('products-title').textContent = 'Products';
            document.getElementById('products-section').innerHTML = '<p>No products selected.</p>';
        }
}
