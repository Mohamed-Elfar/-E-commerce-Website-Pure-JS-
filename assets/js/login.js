// login.js
import { showToast } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const email = form.email.value;
    const password = form.password.value;

    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      showToast("success", "Login successful!");
      open("index.html", "_self");
    } else {
      showToast("error", "please check your email or password.");
    }
  });
});
