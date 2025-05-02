import { showToast } from "../../assets/js/utils.js";
fetch("../../assets/data/products.json")
  .then((res) => res.json())
  .then((data) => {
    localStorage.setItem("allProducts", JSON.stringify(data));
    const container = document.getElementById("product-container");
    data.forEach((elem) => {
      const card = document.createElement("div");
      card.classList.add("col-md-4");
      card.innerHTML = `
      <div class="product bg-light">
        <div class="product__badge">
          <div class="product__actions">
            <div class="product__discount" style="${
              elem.sale ? "" : "visibility: hidden"
            }">-${elem.sale || ""}</div>
            <div class="product__icons">
              <a class="border-0">
                <div class="product__icon-container"><i class="product__icon fa-regular fa-heart" aria-hidden="true"></i></div>
              </a>
              <a href="product-details.html?id=${elem.id}"  class="border-0">
                <div class="product__icon-container"><i class="product__icon fa-regular fa-eye" aria-hidden="true"></i></div>
              </a>
            </div>
          </div>
          <img class="product__image" src="${elem.image}" alt="${
        elem.name
      }" loading="lazy">
          <a href="#"><div class="product__overlay">Add To Cart</div></a>
        </div>
        <div>
          <p class="product__title">${elem.name}</p>
          <div class="product__price">
            <p class="product__price-new">$${elem.price}</p>
            <p class="product__price-old">$${(elem.price + 40).toFixed(2)}</p>
          </div>
          <div class="product__rating">
            ${[...Array(5)]
              .map(
                (_, i) =>
                  `<i class="product__rating-star ${
                    i < elem.Rating ? "fa-solid" : "fa-regular"
                  } fa-star" aria-hidden="true"></i>`
              )
              .join("")}
            <p class="product__rating-count">(${elem.ratingCount})</p>
          </div>
          <div class="col-md-12">
            <button class="btn btn-dark w-100 cartBTn" data-id="${
              elem.id
            }">Add To Cart</button>
          </div>
        </div>
      </div>
    `;
      const addBtn = card.querySelector(".cartBTn");
      addBtn.addEventListener("click", () => addToCart(elem));
      const wishBtn = card.querySelector(".fa-heart");
      wishBtn.addEventListener("click", () => addToWishList(elem));
      container.appendChild(card);
    });
  })
  .catch((error) => {
    document.getElementById("product-container").textContent =
      "Failed to load products.";
    console.error("Error loading products:", error);
  });

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart.includes(productId)) {
    cart.push(productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    showToast("success", "Added to cart!");
  } else {
    showToast("success", "Added to cart!");
  }
}

function addToWishList(productId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    showToast("success", "Product Added to Your Wish List");
  }
}
