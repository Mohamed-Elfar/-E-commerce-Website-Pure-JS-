// const sideImgs = document.querySelectorAll(".side-imgs__img");
// const mainImg = document.querySelector(".main-img__img");

// /* product images function */

// for (let i = 0; i < sideImgs.length; i++) {
//   sideImgs[i].addEventListener("click", function (e) {
//     sideImgs.forEach((img) => img.classList.remove("active-img"));
//     let targetImg = e.target;
//     // console.log(targetImg);
//     targetImg.classList.add("active-img");
//     mainImg.src = targetImg.src;
//   });
// }

const productId = parseInt(new URLSearchParams(location.search).get("id"));
console.log(productId);

const products = JSON.parse(localStorage.getItem("products"));
const product = products.find((p) => p.id === productId);

const productName = document.getElementById("productName");
const productQuantity = document.getElementById("productQuantity");
const productPrice = document.getElementById("productPrice");
const productDesc = document.getElementById("productDesc");
const sideImgs = document.getElementById("sideImgs");
const mainImg = document.getElementById("mainImg");

console.log(productName);

function displayProductDetails() {
  if (product.images.length > 0) {
    mainImg.src = product.images[0];
  }
  if (product.images.length > 0) {
    let box = "";
    for (let i = 0; i < product.images.length; i++) {
      box += `
        <img
        class="side-imgs__img img-thumbnail ${i === 0 ? "active-img" : ""}"
        src="${product.images[i]}"
        alt="controller."
      />
        `;
    }
    sideImgs.innerHTML = box;
    const sideImgsAll = document.querySelectorAll(".side-imgs__img");
    for (let i = 0; i < sideImgsAll.length; i++) {
      sideImgsAll[i].addEventListener("click", function (e) {
        sideImgsAll.forEach((img) => img.classList.remove("active-img"));
        let targetImg = e.target;
        // console.log(targetImg);
        targetImg.classList.add("active-img");
        mainImg.src = targetImg.src;
      });
    }
  }
  productName.textContent = product.name;
  productPrice.textContent = `${product.price}`;
  productQuantity.textContent += product.quantity;
  productDesc.textContent = product.description;
}

displayProductDetails();
