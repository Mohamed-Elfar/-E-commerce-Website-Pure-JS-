import {
  showToast,
  validatePassword,
  validatePasswordMatch,hashPassword
} from "../assets/js/utils.js";
const forgetEmail = document.querySelector("#forgetEmailInput");
const submitEmailBtn = document.querySelector("#submitEmailBtn");
const closeEmailBtn = document.querySelector(".emailModal");
const closePasswordBtn = document.querySelector(".passwordModal");

const newPassword = document.querySelector("#resetPassword");
const repass = document.querySelector("#resetConfirmpassword");

submitEmailBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const users = JSON.parse(localStorage.getItem("users"));
  const foundUser = users.find((user) => user.email === forgetEmail.value);
  if (foundUser) {
    showToast("success", "Email sent successfully");
    flipModal();
    newPassword.addEventListener("input", () => {
      validatePassword(newPassword);
    });
    repass.addEventListener("input", () => {
      validatePasswordMatch(newPassword, repass);
    });
  } else {
    showToast("error", "Email not found");
  }
});

function flipModal() {
  const modal = document.querySelectorAll(".modal")[0];
  modal.classList.add("flip");
  setTimeout(() => {
    modal.classList.remove("flip");
    closeEmailBtn.click();
    var myModal = new bootstrap.Modal(document.getElementById("resetModal"));
    myModal.show();
  }, 200);
}

const saveBtn = document.querySelector(".saveBtn");
saveBtn.addEventListener("click", save);
function save() {
  if (newPassword.value === repass.value) {
    const users = JSON.parse(localStorage.getItem("users"));
    const foundUser = users.find((user) => user.email === forgetEmail.value);
    foundUser.password = hashPassword(newPassword.value);
    localStorage.setItem("users", JSON.stringify(users));
    showToast("success", "Password changed successfully");
    closePasswordBtn.click();
    newPassword.value = "";
    repass.value = "";
  }
}
