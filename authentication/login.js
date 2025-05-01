// login.js
import { showToast } from "../assets/js/utils.js";

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
      localStorage.setItem("token", generateToken());
      showToast("success", "Login successful!");
      open("../../index.html", "_self");
    } else {
      showToast("error", "please check your email or password.");
    }
  });
});


function generateToken() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789|*-`~!@#$%^&*()_{}[]|:;'<>,.";

  let token = "";
  for (let i = 0; i < 64; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

