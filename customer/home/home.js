import { creatProductCard, fetchResponse } from "/assets/js/main.js";
import { redirectToNotFoundPage } from "/assets/js/utils.js";

const sidebar = document.getElementById("sidebar");
const backdrop = document.querySelector(".sidebar-backdrop");

// Show/hide sync
sidebar.addEventListener("show.bs.collapse", () => {
  backdrop.classList.add("show");
  document.addEventListener("click", closeOnClickOutside);
});

sidebar.addEventListener("hide.bs.collapse", () => {
  backdrop.classList.remove("show");
  document.removeEventListener("click", closeOnClickOutside);
});

// Close when clicking backdrop
backdrop.addEventListener("click", () => {
  new bootstrap.Collapse(sidebar).hide();
});

// Close when clicking outside
export function closeOnClickOutside(event) {
  if (
    !sidebar.contains(event.target) &&
    !document
      .querySelector('[data-bs-toggle="collapse"][data-bs-target="#sidebar"]')
      .contains(event.target)
  ) {
    new bootstrap.Collapse(sidebar).hide();
  }
}

// ------------------------------------------------------------------------------ //

export function fetchSliceBestSelling() {
  var productsSection = document.getElementById('best-selling');
  fetchResponse().then(products => {
    products.sort((a, b) => (b.ratingCount || 0) - (a.ratingCount || 0)).slice(0, 4).sort(() => Math.random() - 0.5).forEach(product => {
      productsSection.appendChild(creatProductCard(product));
    });
  }).catch(() => redirectToNotFoundPage(true));
};
fetchSliceBestSelling();


export function fetchSliceFlashSales() {
  var productsSection = document.getElementById('flash-sales');

  fetchResponse().then(products => {
    products.filter(
      product => product.sale != null && product.sale !== ''
    ).slice(0, 4).sort(() => Math.random() - 0.5).forEach(product => {
      productsSection.appendChild(creatProductCard(product));
    });
  }).catch(() => redirectToNotFoundPage(true));
};
fetchSliceFlashSales();


export function fetchSliceAllProducts() {
  var productsSection = document.getElementById('our-products');
  fetchResponse().then(products => {
    products.sort(() => Math.random() - 0.5).slice(0, 4).forEach(product => {
      productsSection.appendChild(creatProductCard(product));
    });
  }).catch(() => redirectToNotFoundPage(true));
};
fetchSliceAllProducts();


