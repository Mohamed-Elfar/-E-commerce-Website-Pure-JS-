document.querySelector("#saveChanges").addEventListener("click", function (e) {
    e.preventDefault(); // Prevent actual form submission

    const userData = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      currentPassword: document.getElementById("currentPassword").value,
      newPassword: document.getElementById("newPassword").value,
      confirmPassword: document.getElementById("confirmPassword").value
    };

    if (userData.newPassword !== userData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    console.log("✅ Data to save:", userData);
    alert("Profile saved successfully!");

    window.location.href = "/customer/home/home.html";
  });