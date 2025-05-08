// change username to my email

const gettoken = localStorage.getItem("token") || "";
const users = JSON.parse(localStorage.getItem("users")) || [];
const username = document.querySelector("#username");
// const orders = JSON.parse(localStorage.getItem("orders")) || [];
const orderitems = document.querySelector(".order-items");

(function () {
if (!gettoken) {
    window.location.href = "../../authentication/login.html";
}else{
    const currentUser = users.find((user) => user.token === gettoken);
    if (!currentUser) {
        window.location.href = "../../authentication/login.html";
    }
    username.innerHTML = currentUser.firstName;

    console.log(currentUser);
    let orders = currentUser.orders || [];
    
orders.forEach((order) => {
    const orderContainer = document.createElement("div");
    orderContainer.className = "order-container d-flex flex-column gap-3 p-4 rounded shadow-sm mb-3";
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
                <button class="button-cancel btn d-none text-danger" style="width: 100px; height: 35px; background-color:rgb(250, 250, 250); ">Cancel</button>
            </div>
            <div class="d-flex gap-2">
                <div class="d-flex">
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
    orderitems.appendChild(orderContainer);


    const completedorder = orderContainer.querySelector(".completed-order");
    const waitingorder = orderContainer.querySelector(".waiting-order");
    const canceledorder = orderContainer.querySelector(".canceled-order");
    const orderstatus = orderContainer.querySelector(".order-status");
    const cancelbtn = orderContainer.querySelector(".button-cancel");
    if (order.orderStatus === "completed") {
        CompletedOrder();

    } else if (order.orderStatus === "waiting") {
        WaitingOrder();
        cancelbtn.style.display = "block";
        orderContainer.addEventListener("mouseenter", () => {
            orderContainer.style.backgroundColor = "";
            cancelbtn.classList.remove("d-none");
            cancelbtn.style.display = "block";
          });
          
          orderContainer.addEventListener("mouseleave", () => {
            cancelbtn.classList.add("d-none");
            orderContainer.style.backgroundColor = ""; // يرجعه للحالة الأصلية
          });
        
    } else if (order.orderStatus === "canceled") {
        CanceledOrder();
    }
    else{
        orderContainer.style.backgroundImage = 'url("/assets/images/error-message.png")';
    };

    cancelbtn.addEventListener("click", () => {
        order.orderStatus = "canceled";
        localStorage.setItem("users", JSON.stringify(users));
    });  

    function CompletedOrder(){
        waitingorder.classList.remove("opacity-100");
        waitingorder.classList.add("opacity-25");
        completedorder.classList.remove("opacity-25");
        completedorder.classList.add("opacity-100");
        orderstatus.textContent = "Delivered";
    }
    // CompletedOrder();
    function WaitingOrder(){
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
});


}
})();





