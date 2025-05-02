const sidebar = document.getElementById('sidebar');
const backdrop = document.querySelector('.sidebar-backdrop');

// Show/hide sync
sidebar.addEventListener('show.bs.collapse', () => {
    backdrop.classList.add('show');
    document.addEventListener('click', closeOnClickOutside);
});

sidebar.addEventListener('hide.bs.collapse', () => {
    backdrop.classList.remove('show');
    document.removeEventListener('click', closeOnClickOutside);
});

// Close when clicking backdrop
backdrop.addEventListener('click', () => {
    new bootstrap.Collapse(sidebar).hide();
});

// Close when clicking outside
function closeOnClickOutside(event) {
    if (!sidebar.contains(event.target) &&
        !document.querySelector('[data-bs-toggle="collapse"][data-bs-target="#sidebar"]').contains(event.target)) {
        new bootstrap.Collapse(sidebar).hide();
    }
}

// ------------------------------------------------------------------------------ //



function fetchFlashSalesData() {
    var productsSection = document.getElementById('flash-sales');
    console.log(productsSection);
    fetch('/assets/data/products.json')
        .then(response => response.json())
        .then(products => {
            products.slice(0, 4).forEach(product => {
                var productCard = document.createElement('product-card');
                productCard.setAttribute('name', product.name);
                productCard.setAttribute('price', product.price);
                productCard.setAttribute('image', product.image);
                productCard.setAttribute('ratingCount', product.ratingCount);
                productsSection.appendChild(productCard);
            });

            return products;
        })
        .catch(error => console.error('Error loading JSON:', error));
};
fetchFlashSalesData();