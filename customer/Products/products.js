import {
  showToast,
  addToCart,
  search,
  toggleWishList,
  redirectToNotFoundPage
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
              <div class="product__discount" style="${product.sale ? "" : "visibility: hidden"}">${product.sale}</div>
              <div class="product__icons">
                <a class="border-0">
                  <div class="product__icon-container">
                    <i class="product__icon fa-heart ${isWished ? "active fa-solid" : "fa-regular"}" aria-hidden="true"></i>
                  </div>
                </a>
                <a href="/customer/product-details/product-details.html?id=${product.id}" class="border-0">
                  <div class="product__icon-container">
                    <i class="product__icon fa-regular fa-eye" aria-hidden="true"></i>
                  </div>
                </a>
              </div>
            </div>
            <img class="product__image" src="${product.image}" alt="${product.name}" loading="lazy">
            <a href="#"><div class="product__overlay">Add To Cart</div></a>
          </div>
          <div>
            <div class="d-flex">
              <p class="product__title">${product.name.slice(1,30)}</p>
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
                .map((_, i) =>
                  `<i class="product__rating-star ${
                    i < product.rating ? "fa-solid" : "fa-regular"
                  } fa-star"></i>`
                )
                .join("")}
              <p class="product__rating-count">(${product.ratingCount})</p>
            </div>
            <div class="col-md-12">
            <button class="btn btn-dark w-100 cartBTn" data-id="${product.id}"><i class="fa-solid fa-cart-plus px-2"></i> Add To Cart</button>
            </div>
          </div>
        </div>
      `;

      card.querySelector(".cartBTn").addEventListener("click", () => addToCart(product));
      const wishIcon = card.querySelector(".fa-heart");
      wishIcon.addEventListener("click", () =>
        toggleWishList(product.id.toString(), wishIcon)
      );

      container.appendChild(card);
    });

 

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const productCards = document.querySelectorAll('#product-container .col-md-4');

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => filterProducts(productCards, checkboxes));
    });
  })
  .catch((error) => {
    document.getElementById("product-container").textContent = "Failed to load products.";
    console.error("Error loading products:", error);
  });

search("product__title", ".col-md-4");

function filterProducts(productCards, checkboxes) {
  const checkedCategories = [];
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedCategories.push(checkbox.value);
    }
  });

  productCards.forEach((card) => {
    const cardCategory = card.querySelector(".product__category").dataset.category;
    if (checkedCategories.length === 0 || checkedCategories.includes(cardCategory)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}
document.getElementById("filterPriceBtn").addEventListener("click", () => {
  const min = parseFloat(document.getElementById("minPrice").value) || 0;
  const max = parseFloat(document.getElementById("maxPrice").value) || Infinity;

  const allCards = document.querySelectorAll("#product-container .col-md-4");
  allCards.forEach(card => {
    const priceText = card.querySelector(".product__price-new")?.textContent.replace("$", "") || "0";
    const price = parseFloat(priceText);
    if (price >= min && price <= max) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});
