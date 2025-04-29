import { showToast } from "./utils.js";
var existingUsers = JSON.parse(localStorage.getItem("users")) || [];

function saveUserToLocal(userInstance) {
  try {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const newUser = userInstance.toJSON();

    // Validate newUser
    if (!newUser || typeof newUser !== "object") {
      throw new Error("Invalid user data format");
    }

    if (!newUser.email || !newUser.firstName || !newUser.lastName) {
      throw new Error("Missing required user fields");
    }

    // Check for existing email
    const exists = users.some((user) => user && user.email === newUser.email);

    if (exists) {
      throw new Error("This email already exists");
    }

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    open("login.html", "_self");
    return true;
  } catch (error) {
    console.error("Failed to save user:", error);
    showToast("error", error.message);
    throw error;
  }
}
class User {
  static totalUsers = 0;
  #firstName;
  #lastName;
  #email;
  #phone;
  #password;
  #sellerRadio;
  #userId;

  constructor({
    first_name,
    last_name,
    email,
    phone_number,
    password,
    want_to_be_seller,
  }) {
    if (new.target === User) {
      throw new Error(
        "User is an abstract class and cannot be instantiated directly."
      );
    }

    // First assign all properties
    this.#firstName = first_name;
    this.#lastName = last_name;
    this.#email = email;
    this.#phone = phone_number;
    this.#password = password;
    this.#sellerRadio = want_to_be_seller;

    User.totalUsers++;
    this.#userId = User.totalUsers;

    // Then save to local storage
    if (typeof saveUserToLocal === "function") {
      saveUserToLocal(this);
    } else {
      throw new Error("Save functionality not available");
    }

    console.log("Created user:", this);
  }

  get userId() {
    return this.#userId;
  }

  toJSON() {
    return {
      userId: this.#userId,
      firstName: this.#firstName,
      lastName: this.#lastName,
      email: this.#email,
      phone: this.#phone,
      password: this.#password,
      want_to_be_seller: this.#sellerRadio,
      role: this.constructor.name,
    };
  }

  print() {
    console.log(`User ID: ${this.#userId}`);
  }
}

// Customer class
class Customer extends User {
  static customerCount = 0;
  #customerId;

  constructor(userData) {
    super(userData);
    Customer.customerCount++;
    this.#customerId = Customer.customerCount;
  }

  print() {
    super.print();
    console.log(`Customer ID: ${this.#customerId}`);
  }
}

// Seller class
class Seller extends User {
  static sellerCount = 0;
  #sellerId;

  constructor(userData) {
    super(userData);
    Seller.sellerCount++;
    this.#sellerId = Seller.sellerCount;
  }

  print() {
    super.print();
    console.log(`Seller ID: ${this.#sellerId}`);
  }
}

// Admin class
class Admin extends Seller {
  static adminCount = 0;
  #adminId;

  constructor(userData) {
    super(userData);
    Admin.adminCount++;
    this.#adminId = Admin.adminCount;
  }

  print() {
    super.print();
    console.log(`Admin ID: ${this.#adminId}`);
  }
}

console.log(JSON.parse(localStorage.getItem("users")));

let form = document.querySelector("form");
let signupImg = document.querySelector("picture>img");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Get form elements
  var firstName = form.firstname;
  var lastName = form.lastname;
  var email = form.email;
  var phone = form.phonenumber;
  var password = form.password;
  var confirmPassword = form.confirmpassword;
  var sellerRadio = form.role;
  // Validate all fields
  const isValid = validateForm(
    firstName,
    lastName,
    email,
    phone,
    password,
    confirmPassword
  );

  if (isValid) {
    const data = {
      first_name: firstName.value.trim(),
      last_name: lastName.value.trim(),
      email: email.value.trim(),
      phone_number: phone.value.trim(),
      password: password.value,
      want_to_be_seller: sellerRadio.checked ? true : false,
    };

    console.log("Form data:", data);

    try {
      new Customer(data);
      showToast("success", "Account created successfully!");
      // Optionally redirect or reset form
    } catch (error) {
      showToast("error", error.message);
    }
  } else {
    showToast("error", "Please fix the validation errors.");
  }
});

document.getElementById("firstname").addEventListener("input", function () {
  validateName(this);
});
document.getElementById("lastname").addEventListener("input", function () {
  validateName(this);
});
document.getElementById("email").addEventListener("input", function () {
  validateEmail(this);
});
document.getElementById("phonenumber").addEventListener("input", function () {
  validatePhone(this);
});
document.getElementById("password").addEventListener("input", function () {
  validatePassword(this);
});
document
  .getElementById("confirmpassword")
  .addEventListener("input", function () {
    validatePasswordMatch();
  });

function validateName(input) {
  var reName = /^[a-zA-Z ]+$/;
  if (!reName.test(input.value)) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    signupImg.style.height = "600px";
    return false;
  } else {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    return true;
  }
}

function validateEmail(input) {
  var reEmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!reEmail.test(input.value)) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    signupImg.style.height = "600px";

    return false;
  } else {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    return true;
  }
}

function validatePhone(input) {
  var rePhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  if (!rePhone.test(input.value)) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    signupImg.style.height = "600px";

    return false;
  } else {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    return true;
  }
}

function validatePassword(input) {
  var rePassword =
    /^(?=.*[A-Z])(?=.*[a-zA-Z0-9])(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~\-]).{6,}$/;
  if (!rePassword.test(input.value)) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    signupImg.style.height = "600px";
    return false;
  } else {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    return true;
  }
}

function validatePasswordMatch() {
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("confirmpassword").value;
  if (password !== confirmPassword) {
    document.getElementById("confirmpassword").classList.add("is-invalid");
    document.getElementById("confirmpassword").classList.remove("is-valid");
    signupImg.style.height = "600px";
    return false;
  } else {
    document.getElementById("confirmpassword").classList.remove("is-invalid");
    document.getElementById("confirmpassword").classList.add("is-valid");
    return true;
  }
}

function validateForm(
  firstName,
  lastName,
  email,
  phone,
  password,
  confirmPassword
) {
  let valid = true;

  if (!validateName(firstName)) valid = false;
  if (!validateName(lastName)) valid = false;
  if (!validateEmail(email)) valid = false;
  if (!validatePhone(phone)) valid = false;
  if (!validatePassword(password)) valid = false;
  if (!validatePasswordMatch()) valid = false;

  return valid;
}

// async function callApi(data) {
//   try {
//     const response = await fetch("http://127.0.0.1:8000/api/signup/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     const result = await response.json();
//     console.log(result);
//     localStorage.setItem("token", result.token);
//     if (!response.ok) {
//       showToast("error", `Error ${result.error}.`);
//     } else {
//       showToast("success", "Your account has been created successfully.");
//       open("login.html", "_self");
//     }
//   } catch (error) {
//     showToast("error", "Something went wrong. Please try again later.");
//   }
// }

// // Test data
// const data = {
//   first_name: "mohamed",
//   last_name: "samir",
//   email: "mohamedsamiir252@gmail.com",
//   phone_number: "01060493174",
//   password: "Mohamed@2468",
//   want_to_be_seller: true,
// };

// // Create instances
// const user1 = new Customer(data);
// const user2 = new Seller(data);
// const user3 = new Admin(data);

// // // Print details
// // user1.print();
// // user2.print();
// // user3.print();

// // Save to localStorage (if not already saved)
// saveUserToLocal(user1);
// saveUserToLocal(user2);
// saveUserToLocal(user3);

// Log stored users for confirmation
