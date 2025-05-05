import { showToast } from "../assets/js/utils.js";
if (localStorage.getItem("token")) {
  location.href = "../index.html";
}


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
      const token = generateToken();
      localStorage.setItem("token", token);
      user.token = token;
      const updatedUsers = users.map((u) =>
        u.email === user.email ? { ...u, token } : u
      );
      console.log(updatedUsers);

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      showToast("success", "Login successful!");
      setTimeout(() => {
        open("../../index.html", "_self");
      }, 1500);
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
