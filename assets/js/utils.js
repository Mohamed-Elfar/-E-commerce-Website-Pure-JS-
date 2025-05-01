export function showToast(status, message) {
    // console.log(status, message);
    var toast = document.querySelector(".toast");
    toast.classList.remove("toast-error", "toast-success");
    if (status == "success") {
      toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
      toast.classList.add("show", "toast-success");
      console.log("success");

    } else if (status == "error") {
      toast.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${message} `;
      toast.classList.add("show", "toast-error");
      console.log("error");
    } else {
      throw new Error("Invalid status");
      console.log('invaild')
    }
    setTimeout(function () {
      toast.classList.remove("show");
    }, 3000);
    // console.log(status, message);

  }