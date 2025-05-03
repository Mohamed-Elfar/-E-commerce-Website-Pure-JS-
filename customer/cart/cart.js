    const processButton = document.querySelector('.button--process');
    processButton.addEventListener('click', () => {
      window.location.href = '../checkout/checkout.html';
    });

    const returnButton = document.querySelector('.button--return');
    returnButton.addEventListener('click', () => {
      window.location.href = '/index.html';
    });

    fetch('/assets/data/products.json')
      .then(response => response.json())
      .then(data => {
        const ids = [1, 14, 29];
        const tbody = document.querySelector('tbody');
        const subtotalInCart = document.getElementById('subtotalincart');
        const shipping = document.getElementById('shipping');
        const total = document.getElementById('Total');
        const couponInput = document.getElementById('coupon');
        const couponButton = document.querySelector('.button--coupon');
        const clearButton = document.querySelector('.button--clear');

        let discount = 0;
        let shippingCost = 30;
        const cartItems = [];

        ids.forEach(id => {
          const productData = data.find(product => product.id === id);
          if (productData) {
            const row = document.createElement('tr');

            row.innerHTML = `
              <td ><img src="${productData.image}" width="50"> <p>${productData.name}</p></td>
              <td class="price">${productData.price}</td>
              <td><input type="number" class="quantity form-control" min="1" value="1"></td>
              <td class="subtotal">$${productData.price}</td>
              <td><button class="btn btn-sm  border-0  delete-btn">X</button></td>
            `;

            tbody.appendChild(row);

            const quantityInput = row.querySelector('.quantity');
            const subtotalCell = row.querySelector('.subtotal');
            const deleteButton = row.querySelector('.delete-btn');
            const price = productData.price;

            cartItems.push({ quantityInput, subtotalCell, price, row });

            quantityInput.addEventListener('input', () => {
              const quantity = parseInt(quantityInput.value) || 1;
              subtotalCell.innerText = `$${(quantity * price).toFixed(2) }`;
              updateCartTotal();
            });

            deleteButton.addEventListener('click', () => {
              row.remove();
              const index = cartItems.findIndex(item => item.quantityInput === quantityInput);
              if (index !== -1) cartItems.splice(index, 1);
              updateCartTotal();
            });
          }
        });

        function updateCartTotal() {
          let subtotalSum = 0;
          cartItems.forEach(item => {
            const quantity = parseInt(item.quantityInput.value) || 1;
            subtotalSum += quantity * item.price;
          });

          const discountedSubtotal = subtotalSum * (1 - discount);
          subtotalInCart.innerText = `$${ subtotalSum.toFixed(2) }`;
          shipping.innerText = `$${ shippingCost }`;
          total.innerText = `$${ (discountedSubtotal + shippingCost).toFixed(2) }`;
        }

        couponButton.addEventListener('click', () => {
          const couponCode = couponInput.value.trim();
          if (couponCode === "Group6-30") {
            discount = 0.3;
            couponInput.style.border = "3px solid green";
          } else {
            discount = 0;
            couponInput.style.border = "3px solid red";
          }
          updateCartTotal();
        });

        clearButton.addEventListener('click', () => {
          tbody.innerHTML = '';
          cartItems.length = 0;
          updateCartTotal();
        });

        updateCartTotal();
      })
      .catch(error => {
        console.error("❌ Error:", error);
      });
  