
// Function to handle form submission
function addProduct(event) {
    event.preventDefault(); // Prevent default form submission

    // Validate form
    if (!validateForm(event.target)) {
        return;
    }

    // Get form data
    const formData = new FormData(event.target);
    const productData = Object.fromEntries(formData.entries());

    // Generate ID and set default values
    productData.id = generateProductId();
    productData.rating = "0.0";
    productData.reviews = "0";

    // Add the new product to the table
    addProductToTable(productData);

    // Close the modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    modal.hide();
    event.target.reset();

    // Show success message
    alert('Product added successfully!');
}

// Form validation
function validateForm(form) {
    const requiredFields = ['name', 'description', 'stock', 'category', 'price', 'primaryImage'];

    for (const field of requiredFields) {
        if (!form[field].value.trim()) {
            alert(`Please fill in the ${field} field`);
            form[field].focus();
            return false;
        }
    }

    // Validate price and stock are positive numbers
    if (parseFloat(form['price'].value) <= 0 || parseInt(form['stock'].value) < 0) {
        alert('Price must be positive and stock cannot be negative');
        return false;
    }

    return true;
}

// Generate product ID
function generateProductId() {
    return Math.floor(Math.random() * 1000) + 100; // IDs between 100-1099
}

// Add product to table
function addProductToTable(product) {
    const tbody = document.querySelector('table tbody');

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${product.id}</td>
        <td>
          <div class="d-flex align-items-center">
            <img src="${product.primaryImage}" class="product-img me-3" alt="${product.name}" 
                 onerror="this.src='https://via.placeholder.com/60?text=No+Image'">
            <div>
              <div class="fw-semibold">${product.name}</div>
              <small class="text-muted">${product.description.substring(0, 30)}${product.description.length > 30 ? '...' : ''}</small>
            </div>
          </div>
        </td>
        <td>${product.category}</td>
        <td>$${parseFloat(product.price).toFixed(2)}</td>
        <td>
          <span class="badge ${parseInt(product.stock) > 0 ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}">
            ${product.stock} in stock
          </span>
        </td>
        <td>
          <span class="rating-stars ms-1">${product.rating}</span>
        </td>
        <td>${product.reviews}</td>
        <td>
          ${product.sale ? `<span class="badge bg-danger">${product.sale}%</span>` : 'None'}
        </td>
        <td>
          <div class="action-btns d-flex">
            <button class="btn btn-sm btn-outline-primary me-2" onclick="editProduct(this)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(this)">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </td>
      `;

    tbody.insertBefore(row, tbody.firstChild);
}

// Delete product
function deleteProduct(button) {
    if (confirm('Are you sure you want to delete this product?')) {
        button.closest('tr').remove();
    }
}

// Edit product (placeholder - you would implement this)
function editProduct(button) {
    alert('Edit functionality would be implemented here');
    // You would:
    // 1. Get the product data from the row
    // 2. Populate the modal with this data
    // 3. Update the row when saved
}

// Initialize modals when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Any initialization code can go here
});

