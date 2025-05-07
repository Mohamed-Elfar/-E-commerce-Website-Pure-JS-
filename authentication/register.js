import {
  showToast,
  validateEmail,
  validatePassword,
  validatePhone,
  validatePasswordMatch,
  validateName,
  hashPassword,
  User,
} from "../assets/js/utils.js";
if (localStorage.getItem("token")) {
  location.href = "/customer/home/home.html";
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
        password: hashPassword("Mohamed@123"),
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

      setTimeout(() => {
        open("login.html", "_self");
      }, 2000);
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
