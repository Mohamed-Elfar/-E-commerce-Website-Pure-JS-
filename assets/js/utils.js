export function showToast(status, message) {
    console.log(status, message);
  
    var toast = document.querySelector(".toast");
    toast.classList.remove("toast-error", "toast-success");
    if (status == "success") {
      toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
      toast.classList.add("show", "toast-success");
    } else if (status == "error") {
      toast.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${message} `;
      toast.classList.add("show", "toast-error");
    } else {
      throw new Error("Invalid status");
    }
    setTimeout(function () {
      toast.classList.remove("show");
    }, 3000);
  }