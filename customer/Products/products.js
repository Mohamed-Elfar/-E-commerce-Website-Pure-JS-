import {
  showToast,
  addToCart,
  search,
  toggleWishList,
  filterProductsByStoredCategory,
} from "../../assets/js/utils.js";

fetch("../../assets/data/products.json")
  .then((res) => res.json())
  .then((data) => {
    if (!localStorage.getItem("allProducts")) {
      localStorage.setItem("allProducts", JSON.stringify(data));
    }
    const container = document.getElementById("product-container");
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    data.forEach((product) => {
      const card = document.createElement("div");
      card.classList.add("col-md-4");

      const isWished = wishlist.includes(product.id.toString());

      let categoryText = "";
      if (product.category === "Smartphones") {
        categoryText = '<i class="fa-solid fa-mobile-screen-button"></i>';
      } else if (product.category === "Laptops") {
        categoryText = '<i class="fa-solid fa-laptop"></i>';
      } else if (product.category === "Headphones") {
        categoryText = '<i class="fa-solid fa-headphones"></i>';
      } else if (product.category === "Tablets") {
        categoryText = '<i class="fa-solid fa-tablet-screen-button"></i>';
      } else if (product.category === "Smartwatches") {
        categoryText = '<i class="fa-solid fa-clock"></i>';
      } else if (product.category === "Gaming") {
        categoryText = '<i class="fa-solid fa-gamepad"></i>';
      }

      card.innerHTML = `
        <div class="product bg-light">
          <div class="product__badge">
            <div class="product__actions">
              <div class="product__discount" style="${
                product.sale ? "" : "visibility: hidden"
              }">${product.sale}</div>
              <div class="product__icons">
                <a class="border-0">
                  <div class="product__icon-container">
                    <i class="product__icon fa-heart ${
                      isWished ? "active fa-solid" : "fa-regular"
                    }" aria-hidden="true"></i>
                  </div>
                </a>
                <a href="/customer/product-details/product-details.html?id=${
                  product.id
                }" class="border-0">
                  <div class="product__icon-container"><i class="product__icon fa-regular fa-eye" aria-hidden="true"></i></div>
                </a>
              </div>
            </div>
            <img class="product__image" src="${product.image}" alt="${
        product.name
      }" loading="lazy">
            <a href="#"><div class="product__overlay">Add To Cart</div></a>
          </div>
          <div>
            <div class="d-flex">
              <p class="product__title">${product.name}</p>
              <p class="product__category px-2" data-category="${product.category}">${categoryText}</p>
            </div>
            <div class="product__price">
              <p class="product__price-new">$${product.price}</p>
              ${
                product.sale
                  ? `<p class="product__price-old">$${(
                      product.price /
                      (1 - parseFloat(product.sale) / 100)
                    ).toFixed(2)}</p>`
                  : '<p class="product__price-old"></p>'
              }
            </div>
            <div class="product__rating">
              ${[...Array(5)]
                .map(
                  (_, i) =>
                    `<i class="product__rating-star ${
                      i < product.rating ? "fa-solid" : "fa-regular"
                    } fa-star"></i>`
                )
                .join("")}
              <p class="product__rating-count">(${product.ratingCount})</p>
            </div>
            <div class="col-md-12">
              <button class="btn btn-dark w-100 cartBTn" data-id="${
                product.id
              }">Add To Cart</button>
            </div>
          </div>
        </div>
      `;

      // Add to Cart button
      card
        .querySelector(".cartBTn")
        .addEventListener("click", () => addToCart(product));

      // Wishlist icon
      const wishIcon = card.querySelector(".fa-heart");
      wishIcon.addEventListener("click", () =>
        toggleWishList(product.id.toString(), wishIcon)
      );

      container.appendChild(card);
    });

    filterProductsByStoredCategory();
  })
  .catch((error) => {
    document.getElementById("product-container").textContent =
      "Failed to load products.";
    console.error("Error loading products:", error);
  });


search("product__title", ".col-md-4");
