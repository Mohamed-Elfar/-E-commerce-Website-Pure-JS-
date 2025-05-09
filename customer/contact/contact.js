import {
  loginUser,
  showToast,
  validateEmail,
  validatePhone,
  validateName,
} from "/assets/js/utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const user = loginUser();
  const form = document.querySelector("form.needs-validation");

  console.log(form.name);

  const nameInput = form.name;
  const emailInput = form.email;
  const phoneInput = form.phone;
  const messageInput = form.message;

  if (user) {
    if (nameInput) nameInput.value = user.firstName || "";
    if (emailInput) emailInput.value = user.email || "";
    if (phoneInput) phoneInput.value = user.phone || "";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const formData = {
      name: nameInput?.value.trim() || "",
      email: emailInput?.value.trim() || "",
      phone: phoneInput?.value.trim() || "",
      message: messageInput?.value.trim() || "",
      date: formatDate(new Date()),
      role: user.role,
    };

    if (validateForm(formData)) {
      try {
        const savedData = JSON.parse(localStorage.getItem("contact")) || [];
        savedData.push(formData);
        localStorage.setItem("contact", JSON.stringify(savedData));
        showToast("success", "Message sent successfully!");
        form.message.value = "";
      } catch (storageError) {
        showToast("error", "Failed to save form data.");
      }
    }
  });
});

function validateForm(data) {
  validateName(data.name);

  validateEmail(data.email);

  validatePhone(data.phone);

  if (!data.message || data.message.length < 10) {
    showToast("error", "Please enter a message with at least 10 characters");
    return false;
  }

  return true;
}
function formatDate(date) {
  const options = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  return date
    .toLocaleString("en-US", options)
    .replace(",", " at")
    .replace(/\s+/g, " ");
}
