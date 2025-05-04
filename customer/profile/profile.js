import { 
  validateName,
  validateEmail,
  validatePhone,
  validatePasswordMatch,
  validatePassword
} from "/assets/js/utils.js";
(function() {
  const currentToken = localStorage.getItem("token");
  const user = getUserByToken(currentToken);
  if(user){

    document.getElementById("username").innerHTML= user.firstName;
  }else{
    document.getElementById("username").innerHTML= "Guest";
  }
})();


document.querySelector("#saveChanges").addEventListener("click", function (e) {
  e.preventDefault(); // منع الإرسال الحقيقي للفورم

  if (validation()) {
    const currentToken = localStorage.getItem("token");
    const user = getUserByToken(currentToken);

    if (!user) {
      showToast("error", "User not found");
      return;
    }

    // تعديل بيانات المستخدم داخل مصفوفة المستخدمين
    const usersJSON = localStorage.getItem("users");
    const users = JSON.parse(usersJSON);

    const updatedUsers = users.map(u => {
      if (u.token === currentToken) {
        return {
          ...u,
          firstName: document.getElementById("firstName").value,
          lastName: document.getElementById("lastName").value,
          email: document.getElementById("email").value,
          phone: document.getElementById("phonenumber").value,
          password: document.getElementById("newpassword").value,
        };
      }
      return u;
    });

    // حفظ التعديلات في localStorage
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    showToast("success", "Changes saved successfully");
    // window.location.href = "/customer/home/home.html";
  }
});

function validation() {
  const isFirstNameValid = validateName(document.getElementById("firstName"));
  const isLastNameValid = validateName(document.getElementById("lastName"));
  const isEmailValid = validateEmail(document.getElementById("email"));
  const isPhoneValid = validatePhone(document.getElementById("phonenumber"));
  const isMatchPasswordValid = MatchUserPassword(document.getElementById("currentpassword").value);
  const isNewPasswordValid = validatePassword(document.getElementById("newpassword"));
  const isPasswordMatch = validatePasswordMatch(
    document.getElementById("newpassword"),
    document.getElementById("confirmpassword")
  );

  return (
    isFirstNameValid &&
    isLastNameValid &&
    isEmailValid &&
    isPhoneValid &&
    isNewPasswordValid &&
    isPasswordMatch &&
    isMatchPasswordValid
  );
}

function getUserByToken(token) {
  const usersJSON = localStorage.getItem("users");
  if (!usersJSON) return null;
  const users = JSON.parse(usersJSON);
  const matchedUser = users.find(user => user.token === token);
  return matchedUser || null;
}

function MatchUserPassword(newpassword) {
  const usersJSON = localStorage.getItem("users");
  const users = JSON.parse(usersJSON);
  const matchedUser = users.find(user => user.password === newpassword);
  if (matchedUser) {
    document.getElementById("currentpassword").classList.remove("is-invalid");
    document.getElementById("currentpassword").classList.add("is-valid");
    return true;
  } else {
    document.getElementById("currentpassword").classList.add("is-invalid");
    document.getElementById("currentpassword").classList.remove("is-valid");
    return false;
  }
}
