const returnhome = document.querySelector(".button--return");
returnhome.addEventListener("click", () => {
  window.location.href = "../home/home.html";
});
const users = JSON.parse(localStorage.getItem("users")) || [];
const user = users.find((user) => user.token === localStorage.getItem("token"));
const cart = user.cart || [];
localStorage.setItem("cart", JSON.stringify(cart));
const productInCart = JSON.parse(localStorage.getItem("cart"));

const tbody = document.querySelector("tbody");
const subtotalInCart = document.getElementById("subtotalincart");
const shipping = document.getElementById("shipping");
const total = document.getElementById("Total");
const couponInput = document.getElementById("coupon");
const couponButton = document.querySelector(".button--coupon");
const clearButton = document.querySelector(".button--clear");

let discount = 0;
let shippingCost = 30;
const cartItems = [];
productInCart.forEach((Element) => {
  const productquantity = Element.quantity;
  if (Element) {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>
            <div class="d-flex align-items-center gap-2">
                <img src="${Element.image}" width="50" alt="${Element.name}">
                <p class="mb-0">${Element.name}</p>
            </div>
          </td>
          <td class="price"><div class="d-flex align-items-center" style="height:50px"> $${Element.price}</div></td>
          <td><div class="d-flex align-items-center" style="height:50px"> <input type="number" class="quantity form-control" min="1" max="${productquantity}" value="${Element.count}"> </div></td>
          <td class="subtotal"><div class="d-flex align-items-center" style="height:50px"> $${Element.price}</div> </td>
          <td><button class="btn btn-sm border-0 delete-btn">X</button></td>
        `;

    tbody.appendChild(row);

    const quantityInput = row.querySelector(".quantity");
    const subtotalCell = row.querySelector(".subtotal");
    const deleteButton = row.querySelector(".delete-btn");
    const price = Element.price;

    cartItems.push({ quantityInput, subtotalCell, price, row });
    if (!(cartItems.length == 0)) {
      const process = document.querySelector(".button--process");
      process.addEventListener("click", () => {
        window.location.href = "/customer/checkout/checkout.html";
      });
    }

    quantityInput.addEventListener("input", () => {
      const quantity = parseInt(quantityInput.value) || 1;
      subtotalCell.innerHTML = `<div class="d-flex align-items-center" style="height:50px"> $${(
        quantity * price
      ).toFixed(2)} </div>`;
      Element.count = quantity;
      localStorage.setItem("cart", JSON.stringify(productInCart));
      updateCartTotal();
    });

    deleteButton.addEventListener("click", () => {
      row.remove();
      const index = cartItems.findIndex(
        (item) => item.quantityInput === quantityInput
      );
      if (index !== -1) cartItems.splice(index, 1);

      const updatedCart = productInCart.filter(
        (item) => item.id !== Element.id
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      updateCartTotal();
    });
  }
});

function updateCartTotal() {
  let subtotalSum = 0;
  cartItems.forEach((item) => {
    const quantity = parseInt(item.quantityInput.value) || 1;
    subtotalSum += quantity * item.price;
  });

  const discountedSubtotal = subtotalSum * (1 - discount);
  subtotalInCart.innerText = `$${subtotalSum.toFixed(2)}`;
  shipping.innerText = `$${shippingCost}`;
  total.innerText = `$${(discountedSubtotal + shippingCost).toFixed(2)}`;
}

couponButton.addEventListener("click", () => {
  const couponCode = couponInput.value.trim();
  if (couponCode === "Group6-30") {
    discount = 0.3;
    couponInput.style.border = "3px solid green";
    sendDiscount(discount);
  } else {
    discount = 0;
    couponInput.style.border = "3px solid red";
    sendDiscount(discount);
  }
  updateCartTotal();
});

clearButton.addEventListener("click", () => {
  tbody.innerHTML = "";
  cartItems.length = 0;
  localStorage.removeItem("cart");
  delete user.cart;
  localStorage.setItem("users", JSON.stringify(users));
  updateCartTotal();
  window.location.reload();
});

updateCartTotal();

function sendDiscount(Discount) {
  const cartJSON = localStorage.getItem("cart");
  const cart = cartJSON ? JSON.parse(cartJSON) : [];

  const updatedCart = cart.map((item) => ({
    ...item,
    discount: Discount,
  }));

  localStorage.setItem("cart", JSON.stringify(updatedCart));
}
