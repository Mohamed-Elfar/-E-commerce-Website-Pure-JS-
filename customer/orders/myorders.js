import { loginUser } from "/assets/js/utils.js";

const gettoken = localStorage.getItem("token") || "";
const users = JSON.parse(localStorage.getItem("users")) || [];
const username = document.querySelector("#username");
const orderitems = document.querySelector(".order-items");

(function () {
  if (!gettoken) {
    window.location.href = "../../authentication/login.html";
  } else {
    const currentUser = loginUser();

    if (!currentUser) {
      window.location.href = "../../authentication/login.html";
    }
    username.innerHTML = currentUser.firstName;

    let orders = currentUser.orders || [];

    orders.forEach((order) => {
      const orderContainer = document.createElement("div");
      orderContainer.className =
        "order-container d-flex flex-column gap-3 p-4 rounded shadow-sm mb-3";
      orderContainer.style.height = "140px";

      const orderImages = document.createElement("div");
      orderImages.className = "order-images d-flex gap-2";

      order.products.forEach((product) => {
        const img = document.createElement("img");
        img.className = "order-image border-radius";
        img.src = product.image;
        img.alt = "";
        orderImages.appendChild(img);
      });

      // باقي عناصر الطلب:
      orderContainer.innerHTML = `
        <div class="d-flex justify-content-between">
            <div class="d-flex gap-2">
                <p class="fw-bold">Order:</p>
            </div>
            <div class="d-flex gap-2">
                <h6>number:</h6>
                <p>${order.orderId || "123456"}</p>
            </div>
        </div>
        <div class="d-flex justify-content-between">
            <div class="d-flex gap-2">
                <p class="fw-bold">Order Date:</p>
                <p>${order.date.split("T")[0] || "01/01/2023"}</p>
            </div>
            <div>
                <button class="button-return btn btn-warning d-none" style="width: 100px; height: 35px; color:rgb(250, 250, 250); ">Return</button>
                <button class="button-cancel btn d-none text-danger" style="width: 100px; height: 35px; background-color:rgb(250, 250, 250); ">Cancel</button>
            </div>
            <div class="d-flex gap-2">
                <div class="ballsOfStatus d-flex">
                    <div class="completed-order rounded-circle bg-success opacity-25 me-2" style="width: 20px; height: 20px;"></div>
                    <div class="waiting-order rounded-circle bg-warning opacity-25 me-2" style="width: 20px; height: 20px;"></div>
                    <div class="canceled-order rounded-circle bg-danger opacity-25" style="width: 20px; height: 20px;"></div>
                </div>
                <div>
                    <p class="order-status">Delivered</p>
                </div>
            </div>
        </div>
    `;
      // حط الصور جوه أول div في orderContainer
      const firstDiv = orderContainer.querySelector(".d-flex.gap-2");
      firstDiv.appendChild(orderImages);
      // ضيف كل order للـ container العام
      orderitems.prepend(orderContainer);

      const completedorder = orderContainer.querySelector(".completed-order");
      const waitingorder = orderContainer.querySelector(".waiting-order");
      const canceledorder = orderContainer.querySelector(".canceled-order");
      const orderstatus = orderContainer.querySelector(".order-status");
      const cancelbtn = orderContainer.querySelector(".button-cancel");
      const ballsOfStatus = orderContainer.querySelector(".ballsOfStatus");
      const returnedbtn = orderContainer.querySelector(".button-return");
      if (order.orderStatus === "completed") {
        CompletedOrder();
        orderContainer.addEventListener("mouseenter", () => {
          orderContainer.style.backgroundColor = "";
          returnedbtn.classList.remove("d-none");
          returnedbtn.style.display = "block";
        });

        orderContainer.addEventListener("mouseleave", () => {
          returnedbtn.classList.add("d-none");
          orderContainer.style.backgroundColor = ""; // يرجعه للحالة الأصلية
        });
      } else if (order.orderStatus === "waiting") {
        WaitingOrder();
        orderContainer.addEventListener("mouseenter", () => {
          orderContainer.style.backgroundColor = "";
          cancelbtn.classList.remove("d-none");
          cancelbtn.style.display = "block";
        });

        orderContainer.addEventListener("mouseleave", () => {
          cancelbtn.classList.add("d-none");
          orderContainer.style.backgroundColor = ""; // يرجعه للحالة الأصلية
        });
        setTimeout(() => {
          order.orderStatus = "completed";
          localStorage.setItem("users", JSON.stringify(users));
          location.reload();
        }, 3000);
      } else if (order.orderStatus === "canceled") {
        CanceledOrder();
      } else if (order.orderStatus === "needtoReturn") {
        NeedToReturn();
        setTimeout(() => {
          order.orderStatus = "returned";
          localStorage.setItem("users", JSON.stringify(users));
          location.reload();
        }, 3003);
      } else if (order.orderStatus === "returned") {
        returned();
      } else {
        orderContainer.style.backgroundImage =
          'url("/assets/images/error-message.png")';
      }

      cancelbtn.addEventListener("click", (e) => {
        e.preventDefault();
        order.orderStatus = "canceled";
        confirmChange(users, "Cancel Request");
      });
      returnedbtn.addEventListener("click", (e) => {
        e.preventDefault();
        order.orderStatus = "needtoReturn";
        confirmChange(users, "Return Request");
      });

      function CompletedOrder() {
        waitingorder.classList.remove("opacity-100");
        waitingorder.classList.add("opacity-25");
        completedorder.classList.remove("opacity-25");
        completedorder.classList.add("opacity-100");
        orderstatus.textContent = "Delivered";
      }
      // CompletedOrder();
      function WaitingOrder() {
        waitingorder.classList.remove("opacity-25");
        waitingorder.classList.add("opacity-100");
        orderstatus.textContent = "Working On It";
      }
      // WaitingOrder();
      function CanceledOrder() {
        waitingorder.classList.remove("opacity-100");
        waitingorder.classList.add("opacity-25");
        canceledorder.classList.remove("opacity-25");
        canceledorder.classList.add("opacity-100");
        orderstatus.textContent = "Canceled";
      }
      function NeedToReturn() {
        ballsOfStatus.classList.add("d-none");
        orderstatus.textContent = "Work On Return";
        orderstatus.style.color = "rgb(15, 125, 184)";
      }
      function returned() {
        ballsOfStatus.classList.add("d-none");
        orderstatus.textContent = "Returned";
        orderstatus.style.color = "rgb(18, 18, 141)";
      }
    });
  }
})();

function confirmChange(updatedUsers, actionType) {
  Swal.fire({
    title: "Are you sure?",
    text: `You are about to proceed with: ${actionType}. Do you want to continue?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, proceed!",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    background: "#fff",
    color: "#333",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      Swal.fire({
        title: "Success!",
        text: `${actionType} has been processed successfully.`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#27ae60",
      }).then(() => {
        window.location.reload();
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        title: "",
        text: `${actionType} has been canceled..`,
        icon: "info",
        confirmButtonText: "OK",
        confirmButtonColor: "#3498db",
      });
    }
  });
}
