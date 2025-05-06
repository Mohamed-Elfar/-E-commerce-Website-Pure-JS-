import { showToast } from "/assets/js/utils.js";
const cart = JSON.parse(localStorage.getItem("cart") || "[]");
if (cart.length === 0) {
  location.href = "/customer/home/home.html";
}
(function () {
  "use strict";

  function validateCardName(name) {
    return /^[a-zA-Z\s]+$/.test(name);
  }

  function validateCardNumber(number) {
    return (
      /^[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}$/.test(number) ||
      /^[0-9]{16}$/.test(number)
    );
  }

  function validateExpiration(date) {
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(date)) return false;

    const [month, year] = date.split(/\D/);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    return (
      +year > currentYear || (+year === currentYear && +month >= currentMonth)
    );
  }

  function validateCVV(cvv) {
    return /^[0-9]{3,4}$/.test(cvv);
  }

  window.addEventListener("load", function () {
    const form = document.querySelector(".needs-validation");
    const submitButton = document.getElementById("externalSubmit");

    if (submitButton && form) {
      const cardName = document.getElementById("cc-name");
      const cardNumber = document.getElementById("cc-number");
      const expiration = document.getElementById("cc-expiration");
      const cvv = document.getElementById("cc-cvv");

      [cardName, cardNumber, expiration, cvv].forEach((field) => {
        field.addEventListener("input", () => {
          field.setCustomValidity("");
          field.classList.remove("is-invalid");
          field.classList.remove("is-valid");
        });
      });

      submitButton.addEventListener("click", function (event) {
        event.preventDefault();
        form.classList.remove("was-validated");

        const isNameValid = validateCardName(cardName.value);
        const isNumberValid = validateCardNumber(cardNumber.value);
        const isExpValid = validateExpiration(expiration.value);
        const isCvvValid = validateCVV(cvv.value);

        if (!isNameValid) {
          cardName.setCustomValidity(
            "Please enter a valid name (letters only)"
          );
          cardName.classList.add("is-invalid");
        } else {
          cardName.classList.add("is-valid");
        }

        if (!isNumberValid) {
          cardNumber.setCustomValidity(
            "Please enter a valid 16-digit card number"
          );
          cardNumber.classList.add("is-invalid");
        } else {
          cardNumber.classList.add("is-valid");
        }

        if (!isExpValid) {
          expiration.setCustomValidity(
            "Please enter a valid future date (MM/YY)"
          );
          expiration.classList.add("is-invalid");
        } else {
          expiration.classList.add("is-valid");
        }

        if (!isCvvValid) {
          cvv.setCustomValidity("Please enter a valid 3 or 4-digit CVV");
          cvv.classList.add("is-invalid");
        } else {
          cvv.classList.add("is-valid");
        }

        form.classList.add("was-validated");

        if (isNameValid && isNumberValid && isExpValid && isCvvValid) {
          const authToken = localStorage.getItem("token");
          if (!authToken) {
            showToast("error", "Please Login First");
            setTimeout(() => open("/customer/home/home.html", "_self"), 2000);
            return;
          }

          const cart = JSON.parse(localStorage.getItem("cart")) || [];
          const products =
            JSON.parse(localStorage.getItem("allProducts")) || [];
          const users = JSON.parse(localStorage.getItem("users")) || [];
          const user = users.find((user) => user.token == authToken);

          const address = document.getElementById("address").value;
          const address2 = document.getElementById("address2").value;
          const city = document.getElementById("city").value;
          function getSelectedPaymentMethod() {
            const selected = document.querySelector(
              'input[name="paymentMethod"]:checked'
            );
            return selected ? selected.id : null;
          }
          if (user) {
            const newOrder = {
              orderId: user.orders?.length + 1 || 1,
              products: cart,
              date: new Date().toISOString(),
              userId: user.userId,
              address,
              address2,
              city,
              paymentMethod: getSelectedPaymentMethod(),
            };

            const updatedUsers = users.map((user) => {
              if (user.token === authToken) {
                return {
                  ...user,
                  orders: [
                    ...(user.orders || []),
                    {
                      orderId: newOrder.orderId,
                      products: newOrder.products,
                      date: newOrder.date,
                      address,
                      address2,
                      city,
                      paymentMethod: getSelectedPaymentMethod(),
                    },
                  ],
                };
              }
              return user;
            });

            const updatedProducts = products.map((product) => {
              const cartItem = cart.find((item) => item.id === product.id);
              if (!cartItem) return product;

              const newQuantity = Math.max(
                0,
                product.quantity - (cartItem.count || 0)
              );
              return {
                ...product,
                quantity: newQuantity,
              };
            });

            localStorage.setItem(
              "orders",
              JSON.stringify([...(user.orders || []), newOrder])
            );
            localStorage.setItem("users", JSON.stringify(updatedUsers));
            localStorage.setItem(
              "allProducts",
              JSON.stringify(updatedProducts)
            );
            localStorage.removeItem("cart");
            delete user.cart;
            localStorage.setItem("users", JSON.stringify(users));
            showToast("success", "Order placed successfully!");
            setTimeout(() => open("/customer/home/home.html", "_self"), 1500);
          }
        }
      });

      document
        .getElementById("cc-number")
        .addEventListener("input", function (e) {
          let value = e.target.value.replace(/\s/g, "");
          if (value.length > 16) value = value.substring(0, 16);
          if (value.length > 0) {
            value = value.match(/.{1,4}/g)?.join(" ") || value;
          }
          e.target.value = value;
        });

      document
        .getElementById("cc-expiration")
        .addEventListener("input", function (e) {
          let value = e.target.value.replace(/\D/g, "");
          if (value.length > 2) {
            value = value.substring(0, 2) + "/" + value.substring(2, 4);
          }
          if (value.length > 5) value = value.substring(0, 5);
          e.target.value = value;
        });
    }
  });
})();

(function appendProducts() {
  const checkoutCard = document.querySelector(".checkoutCard");
  const badge = document.querySelector("#checkoutBadge");
  const products = JSON.parse(localStorage.getItem("cart")) || [];

  let total = 0;
  let discount;
  let shippingCost = 30;
  badge.innerText = products.length;

  if (products.length > 0) {
    checkoutCard.innerHTML = "";

    products.forEach((product) => {
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center";
      total += (parseFloat(product.price) || 0) * product.count;
      li.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <img src="${product.image}" alt="${product.name}" class="w-25 me-2" />
          <h6 class="my-0">${product.name}</h6>
        </div>
        <span class="text-muted product__price">$${product.price}</span>
      `;
      checkoutCard.appendChild(li);
    });

    discount = products[0]?.discount
      ? (1 - products[0].discount) * total
      : total;
    total = discount;

    const promoLi = document.createElement("li");
    promoLi.className =
      "list-group-item d-flex justify-content-between align-items-center bg-light";
    promoLi.innerHTML = `
      <div class="text-success">
        <h6 class="my-0">Promo code</h6>
        <small>EXAMPLECODE</small>
      </div>
      <span class="text-success">${
        products[0]?.discount ? products[0].discount * 100 : 0
      }%</span>
    `;
    checkoutCard.appendChild(promoLi);

    const shippingLi = document.createElement("li");
    shippingLi.className = "list-group-item d-flex justify-content-between";
    shippingLi.innerHTML = `
      <span>Shipping (USD)</span>
      <strong>$${shippingCost}</strong>
    `;
    checkoutCard.appendChild(shippingLi);

    const totalLi = document.createElement("li");
    totalLi.className = "list-group-item d-flex justify-content-between";
    totalLi.innerHTML = `
      <span>Total (USD)</span>
      <strong>$${(shippingCost + total).toFixed(2)}</strong>
    `;
    checkoutCard.appendChild(totalLi);
  } else {
    checkoutCard.innerHTML = `<h4 class="text-center">No products found</h4>`;
  }
})();
