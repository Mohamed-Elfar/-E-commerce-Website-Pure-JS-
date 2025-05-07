export function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.token === token);
  return user || null;
}
// test
const currentUser = getCurrentUser();
if (currentUser) {
  console.log("Current user:", currentUser);
  console.log("User ID:", currentUser.userId);
  console.log("Role:", currentUser.role);
} else {
  console.log("No user logged in");
}

