import { showToast } from "/assets/js/utils.js";
(function () {
  "use strict";

  function validateCardName(name) {
    return /^[a-zA-Z\s]+$/.test(name);
  }

  function validateCardNumber(number) {
    return /^[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}$/.test(number);
  }

  function validateExpiration(date) {
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(date)) return false;

    const [month, year] = date.split("/");
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
    var form = document.querySelector(".needs-validation");
    var submitButton = document.getElementById("externalSubmit");

    if (submitButton && form) {
      submitButton.addEventListener("click", function (event) {
        const cardName = document.getElementById("cc-name");
        const cardNumber = document.getElementById("cc-number");
        const expiration = document.getElementById("cc-expiration");
        const cvv = document.getElementById("cc-cvv");

        if (!validateCardName(cardName.value)) {
          cardName.setCustomValidity(
            "Please enter a valid name (letters only)"
          );
        } else {
          cardName.setCustomValidity("");
        }

        if (!validateCardNumber(cardNumber.value)) {
          cardNumber.setCustomValidity(
            "Please enter a valid 16-digit card number"
          );
        } else {
          cardNumber.setCustomValidity("");
        }

        if (!validateExpiration(expiration.value)) {
          expiration.setCustomValidity(
            "Please enter a valid future date (MM/YY)"
          );
        } else {
          expiration.setCustomValidity("");
        }

        if (!validateCVV(cvv.value)) {
          cvv.setCustomValidity("Please enter a valid 3 or 4-digit CVV");
        } else {
          cvv.setCustomValidity("");
        }

        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          const authToken = localStorage.getItem("token");
          if (!authToken) {
            event.preventDefault();
            showToast("warning", "Please Login First");
            setTimeout(() => open("../../index.html", "_self"), 2000);
            form.classList.add("was-validated");
            return;
          }

          const cart = JSON.parse(localStorage.getItem("cart"));
          const users = JSON.parse(localStorage.getItem("users"));
          const user = users.find((user) => user.token == authToken);

          if (user) {
            const updatedUsers = users.map((user) => {
              if (user.token === authToken) {
                const newOrder = {
                  orderId: user.orders?.length + 1 || 1,
                  products: cart,
                  date: new Date().toISOString(),
                };

                localStorage.setItem(
                  "orders",
                  JSON.stringify([...(user.orders || []), newOrder])
                );

                return {
                  ...user,
                  orders: [...(user.orders || []), newOrder],
                };
              }
              return user;
            });

            localStorage.setItem("users", JSON.stringify(updatedUsers));
            localStorage.removeItem("cart");
            showToast("success", "Order placed successfully!");
          }

          setTimeout(() => open("/index.html", "_self"), 1500);
          // form.submit();
        }
      });

      document
        .getElementById("cc-number")
        .addEventListener("input", function (e) {
          let value = e.target.value.replace(/\s/g, "");
          if (value.length > 0) {
            value = value.match(new RegExp(".{1,4}", "g")).join(" ");
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
          e.target.value = value;
        });
    }
  });
})();
(function appendProducts() {
  const checkoutCard = document.querySelector(".checkoutCard");
  const badge = document.querySelector(".badge");
  const products = JSON.parse(localStorage.getItem("cart"));

  let total = 0;
  let discount;
  let shippingCost = 30;
  badge.innerHTML = products?.length || 0;

  if (products) {
    products.forEach((product) => {
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center";
      total += parseFloat(product.price);
      li.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <img src="${product.image}" alt="${product.name}" class="w-25 me-2" />
          <h6 class="my-0">${product.name}</h6>
        </div>
        <span class="text-muted product__price">${product.price}$</span>
      `;
      checkoutCard.prepend(li);
    });
    console.log(total);

    discount = (1 - products[0].discount) * total || total;
    total = discount;
    console.log(total);

    const promoLi = document.createElement("li");
    promoLi.className =
      "list-group-item d-flex justify-content-between align-items-center bg-light";
    promoLi.innerHTML = `
      <div class="text-success">
        <h6 class="my-0">Promo code</h6>
        <small>EXAMPLECODE</small>
      </div>
      <span class="text-success">${products[0].discount * 10 || 0}%</span>
    `;
    checkoutCard.appendChild(promoLi);

    const shippingLi = document.createElement("li");
    shippingLi.className = "list-group-item d-flex justify-content-between";
    shippingLi.innerHTML = `
      <span>Shipping (USD)</span>
      <strong>${shippingCost}$</strong>
    `;
    checkoutCard.appendChild(shippingLi);
    const totalLi = document.createElement("li");
    totalLi.className = "list-group-item d-flex justify-content-between";
    totalLi.innerHTML = `
      <span>Total (USD)</span>
      <strong>${
        parseFloat(shippingCost) + parseFloat(total.toFixed(2))
      }$</strong>
    `;
    checkoutCard.appendChild(totalLi);
  } else {
    checkoutCard.innerHTML = `<h4 class="text-center">No products found</h4>`;
  }
})();
