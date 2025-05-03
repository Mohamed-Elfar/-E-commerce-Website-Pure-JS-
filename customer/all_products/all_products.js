function fetchAllProducts() {
    var productsTitle = document.getElementById('products-title');
    var productsSection = document.getElementById('products-section');

    fetch('/assets/data/products.json')
        .then(response => response.json())
        .then(products => {
            products.sort(() => Math.random() - 0.5).forEach(product => {
                var productCard = document.createElement('product-card');
                productCard.className = 'product__card col-12 col-sm-6 col-md-5 col-xl-3';
                productCard.setAttribute('name', product.name || 'Unknown Product');
                productCard.setAttribute('price', product.price || '0.00');
                productCard.setAttribute('image', product.image || '');
                productCard.setAttribute('rating', product.rating || '0');
                productCard.setAttribute('ratingCount', `(${product.ratingCount})` || '0');
                productCard.setAttribute('sale', product.sale || '');
                productCard.setAttribute('category', product.category || '');
                productsTitle.textContent = "All Products";
                productsSection.appendChild(productCard);
            });
            filterProductsByCategory();
        })
        .catch(error => console.error('Error loading JSON:', error));
};
fetchAllProducts();

function filterProductsByCategory() {
    const savedCategory = localStorage.getItem("category");
    if (!savedCategory) return;

    const productCards = document.querySelectorAll(".product__card");
    let hasMatch = false;
    productCards.forEach(card => {
        const category = card.getAttribute("category").toLowerCase();
        const isMatch = category === savedCategory.toLowerCase();
        console.log(isMatch);
        console.log(savedCategory.toLowerCase());
        console.log(category);
        card.style.display = isMatch ? "block" : "none";
        if (isMatch) hasMatch = true;
    });
    localStorage.removeItem("category");

    if (!hasMatch) {
        document.getElementById("products-section").innerHTML = `
            <p class="w-100 h-100">No products found</p>
            `;
    }
}








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
// fetchFlashSalesProducts();