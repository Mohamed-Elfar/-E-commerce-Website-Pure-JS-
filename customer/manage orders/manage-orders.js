const username = document.querySelector("#username");
const users = JSON.parse(localStorage.getItem("users")) || [];
const gettoken = localStorage.getItem("token") || "";

(function () {
    if (!gettoken) {
        window.location.href = "../../authentication/login.html";
    }else{
        const currentUser = users.find((user) => user.token === gettoken);
        if (!currentUser) {
            window.location.href = "../../authentication/login.html";
        }
        username.innerHTML = currentUser.firstName;}
})();