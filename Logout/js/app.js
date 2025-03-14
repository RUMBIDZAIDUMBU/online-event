document.getElementById("logout-btn").addEventListener("click", async () => {
  // Get token from sessionStorage
  const token = sessionStorage.getItem("authToken");

  if (token) {
    try {
      const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove token from sessionStorage
        sessionStorage.removeItem("authToken");

        // Redirect to login page
        window.location.href = "/login.html";
      } else {
        console.error("Logout failed:", await response.text());
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  } else {
    // No token found, just redirect to login
    window.location.href = "/login.html";
  }
});
