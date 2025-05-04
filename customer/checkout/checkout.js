(function () {
  "use strict";

  window.addEventListener("load", function () {
    var form = document.querySelector(".needs-validation");
    var submitButton = document.getElementById("externalSubmit");

    if (submitButton && form) {
      submitButton.addEventListener("click", function (event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          form.submit();
        }

        form.classList.add("was-validated");
      });
    }
  });
})();
// async function loadInitialData() {
//   try {
//     const response = await fetch("/assets/data/products.json");
//     const products = await response.json();

//     if (!localStorage.getItem("allProducts")) {
//       localStorage.setItem("allProducts", JSON.stringify(products));
//       console.log("Initial data loaded");
//     } else {
//       console.log("Initial data already loaded");
//     }
//   } catch (error) {
//     console.error("Error loading initial data:", error);
//   }
// }
// loadInitialData();

(function appendProducts() {
  if (localStorage.getItem("token")) {
    const checkoutCard = document.querySelector(".checkoutCard");
    const badge = document.querySelector(".badge");
    const products = JSON.parse(localStorage.getItem("cart"));

    let total = 0;
    badge.innerHTML = products.length;

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
      const discount = 5;
      total -= discount;
      const promoLi = document.createElement("li");
      promoLi.className =
        "list-group-item d-flex justify-content-between align-items-center bg-light";
      promoLi.innerHTML = `
      <div class="text-success">
        <h6 class="my-0">Promo code</h6>
        <small>EXAMPLECODE</small>
      </div>
      <span class="text-success">-${discount}$</span>
    `;
      checkoutCard.appendChild(promoLi);

      const totalLi = document.createElement("li");
      totalLi.className = "list-group-item d-flex justify-content-between";
      totalLi.innerHTML = `
      <span>Total (USD)</span>
      <strong>${total.toFixed(2)}$</strong>
    `;
      checkoutCard.appendChild(totalLi);
    } else {
      checkoutCard.innerHTML = `<h4 class="text-center">No products found</h4>`;
    }
  } else {
    showAuthAlert();
  }
})();
