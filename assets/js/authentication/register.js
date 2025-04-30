import {
  showToast,
  validateEmail,
  validatePassword,
  validatePhone,
  validatePasswordMatch,
  validateName,
} from "../utils.js";
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

// console.log(JSON.parse(localStorage.getItem("users")));

let form = document.querySelector("form");
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

    // console.log("Form data:", data);

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
    validatePasswordMatch(password,this);
  });

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
  if (!validatePasswordMatch(password, confirmPassword)) valid = false;

  return valid;
}

(async function loadInitialData() {
  try {
    const response = await fetch("../assets/data/users.json");
    const users = await response.json();

    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify(users));
      console.log("Initial data loaded");
    } else {
      console.log("Initial data already loaded");
    }
  } catch (error) {
    console.error("Error loading initial data:", error);
  }
})();
