function fetchAllProducts() {
    var productsTitle = document.getElementById('products-title');
    var productsSection = document.getElementById('products-section');

    fetch('/assets/data/products.json')
        .then(response => response.json())
        .then(products => {
            products.sort(() => Math.random() - 0.5).forEach(product => {
                var productCard = document.createElement('product-card');
                productCard.className = 'col-12 col-sm-6 col-md-5 col-xl-3';
                productCard.setAttribute('name', product.name || 'Unknown Product');
                productCard.setAttribute('price', product.price || '0.00');
                productCard.setAttribute('image', product.image || '');
                productCard.setAttribute('rating', product.rating || '0');
                productCard.setAttribute('ratingCount', `(${product.ratingCount})` || '0');
                productCard.setAttribute('sale', product.sale || '');
                productsTitle.textContent = "All Products";
                productsSection.appendChild(productCard);
            });
        })
        .catch(error => console.error('Error loading JSON:', error));
};
// fetchAllProducts();



function fetchBestSellingProducts() {
    var productsTitle = document.getElementById('products-title');
    var productsSection = document.getElementById('products-section');

    fetch('/assets/data/products.json')
        .then(response => response.json())
        .then(products => {
            products.sort((a, b) => (b.rating || 0) - (a.rating || 0)).sort(() => Math.random() - 0.5).forEach(product => {
                var productCard = document.createElement('product-card');
                productCard.className = 'col-12 col-sm-6 col-md-5 col-xl-3';
                productCard.setAttribute('name', product.name || 'Unknown Product');
                productCard.setAttribute('price', product.price || '0.00');
                productCard.setAttribute('image', product.image || '');
                productCard.setAttribute('rating', product.rating || '0');
                productCard.setAttribute('ratingCount', `(${product.ratingCount})` || '0');
                productCard.setAttribute('sale', product.sale || '');
                productsTitle.textContent = "Best Selling Products";
                productsSection.appendChild(productCard);
            });
        })
        .catch(error => console.error('Error loading products:', error));
};
// fetchBestSellingProducts();


function fetchFlashSalesProducts() {
    var productsTitle = document.getElementById('products-title');
    var productsSection = document.getElementById('products-section');

    fetch('/assets/data/products.json')
        .then(response => response.json())
        .then(products => {
            products.filter(
                product => product.sale != null && product.sale !== ''
            ).sort(() => Math.random() - 0.5).forEach(product => {
                var productCard = document.createElement('product-card');
                productCard.className = 'col-12 col-sm-6 col-md-5 col-xl-3';
                productCard.setAttribute('name', product.name || 'Unknown Product');
                productCard.setAttribute('price', product.price || '0.00');
                productCard.setAttribute('image', product.image || '');
                productCard.setAttribute('rating', product.rating || '0');
                productCard.setAttribute('ratingCount', `(${product.ratingCount})` || '0');
                productCard.setAttribute('sale', product.sale || '');
                productsTitle.textContent = "Best Selling Products";
                productsSection.appendChild(productCard);
            });
        })
        .catch(error => console.error('Error loading products:', error));
};
fetchFlashSalesProducts();