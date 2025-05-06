import {
  showToast,
  validateEmail,
  validatePassword,
  validatePhone,
  validatePasswordMatch,
  validateName,
  hashPassword,
} from "../assets/js/utils.js";
if (localStorage.getItem("token")) {
  location.href = "/customer/home/home.html";
}

function saveUserToLocal(userInstance) {
  try {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const newUser = userInstance.toJSON();

    if (!newUser || typeof newUser !== "object") {
      throw new Error("Invalid user data format");
    }

    if (!newUser.email || !newUser.firstName || !newUser.lastName) {
      throw new Error("Missing required user fields");
    }

    const existEmail = users.some(
      (user) => user && user.email === newUser.email
    );
    const existPhone = users.some(
      (user) => user && user.phone === newUser.phone
    );

    if (existEmail) {
      throw new Error("This email already exists");
    }
    if (existPhone) {
      throw new Error("This Phone Number already exists");
    }

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    return true;
  } catch (error) {
    console.error("Failed to save user:", error);
    showToast("error", error.message);
    throw error;
  }
}
class User {
  static get totalUsers() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.length;
  }

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

    this.#firstName = first_name;
    this.#lastName = last_name;
    this.#email = email;
    this.#phone = phone_number;
    this.#password = hashPassword(password);
    this.#sellerRadio = want_to_be_seller;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    this.#userId =
      users.length > 0 ? Math.max(...users.map((user) => user.userId)) + 1 : 1;

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

class Customer extends User {
  static get customerCount() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.filter((user) => user.role === "Customer").length;
  }
  #customerId;

  constructor(userData) {
    super(userData);

    this.#customerId = Customer.customerCount;
  }
  toJSON() {
    const userData = super.toJSON();
    return userData;
  }
  print() {
    super.print();
    console.log(`Customer ID: ${this.#customerId}`);
  }
}

class Seller extends User {
  static get sellerCount() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.filter((user) => user.role === "Seller").length;
  }
  #sellerId;

  constructor(userData) {
    super(userData);

    this.#sellerId = Seller.sellerCount;
  }

  print() {
    super.print();
    console.log(`Seller ID: ${this.#sellerId}`);
  }
  toJSON() {
    const userData = super.toJSON();
    return userData;
  }
}

class Admin extends User {
  static get adminCount() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.filter((user) => user.role === "Admin").length;
  }
  #adminId;

  constructor(userData) {
    super(userData);

    this.#adminId = Admin.adminCount;
  }

  print() {
    super.print();
    console.log(`Admin ID: ${this.#adminId}`);
  }
  toJSON() {
    const userData = super.toJSON();
    return userData;
  }
  static createAdmin() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const existingAdmin = users.some((user) => user.role === "Admin");

    if (!existingAdmin) {
      const adminData = {
        first_name: "Mohamed",
        last_name: "Samir",
        email: "mohamedsamiir252@gmail.com",
        phone_number: "01060493174",
        password: "Mohamed@123",
        want_to_be_seller: false,
      };

      const newAdmin = {
        ...adminData,
        userId:
          users.length > 0 ? Math.max(...users.map((u) => u.userId)) + 1 : 1,
        role: "Admin",
      };

      users.push(newAdmin);
      localStorage.setItem("users", JSON.stringify(users));
    }
  }
}

let form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  var firstName = form.firstname;
  var lastName = form.lastname;
  var email = form.email;
  var phone = form.phonenumber;
  var password = form.password;
  var confirmPassword = form.confirmpassword;

  var sellerRadio = form.role;

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

    try {
      new Customer(data);
      showToast("success", "Account created successfully!");
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
    validatePasswordMatch(password, this);
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

Admin.createAdmin();
console.log(User.totalUsers);
console.log(Customer.customerCount);
console.log(Seller.sellerCount);
console.log(Admin.adminCount);
