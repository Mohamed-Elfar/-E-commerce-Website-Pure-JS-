import {
  addToCart,
  search,
  showToast,
  updateBadges,
} from "../../assets/js/utils.js";
 
function renderWishlistProducts() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
  const wishlistProducts = allProducts.filter((product) =>
    wishlist.includes(product.id.toString())
  )
  const wishlistNum=document.getElementById("wishlistnum")
  wishlistNum.innerText=`wishlist (${wishlistProducts.length})`
  const wishlistContainer = document.getElementById("wishlist-container");
  wishlistContainer.innerHTML = "";
     wishlistProducts.forEach((product) => {
      const card = document.createElement("div");
      card.classList.add("col-md-4");

 
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
                  <i  class="product__icon  fa-solid fa-trash"></i>
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
          <p class="product__title">${product.name.slice(0,30)}</p>
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
            <div class="col-md-12">
              <button class="btn btn-dark w-100 cartBTn" data-id="${product.id}"><i class="fa-solid fa-cart-plus px-2"></i> Add To Cart</button>
            </div>
          </div>
        </div>
      `;

    card
      .querySelector(".cartBTn")
      .addEventListener("click", () => addToCart(product));
    const deleteBtn = card.querySelector(".fa-trash");
    deleteBtn.onclick = () => {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const updatedWishlist = wishlist.filter(
        (item) => item !== product.id.toString()
      );
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      showToast("success", "Product removed from wishlist");
      renderWishlistProducts();
      updateBadges();
    };
    wishlistContainer.appendChild(card);
  });
}

document.getElementById("AddALlToCart").addEventListener("click", () => {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
  if (wishlist.length === 0) {
    showToast("error", "There are no products");
   }
  const productsToAdd = allProducts.filter((product) =>
    wishlist.includes(product.id.toString())
  );
  productsToAdd.forEach((product) => addToCart(product));
 });


search("product__title", ".col-md-4");
renderWishlistProducts()
 


 