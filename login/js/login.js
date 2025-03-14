// Handle form submission
document
  .getElementById("login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form from submitting normally

    const username = document.getElementById("userName").value;
    const password = document.getElementById("password").value;

    console.log("username: " + username);
    console.log("password: " + password);

    // Basic validation (example: username = admin, password = 1234)
    try {
      // Send POST request to Spring Boot API

      const requestBody = JSON.stringify({ userName: username, password }); // Send username and password as JSON

      console.log(requestBody);

      const response = await fetch(
        "http://localhost:8080/api/ticketing/authenticate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: requestBody,
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Store token in sessionStorage
        sessionStorage.setItem("authToken", data.token);
        // Optionally, redirect to another page
        window.location.href = "/admins/index.html";
      } else {
        const error = await response.text();
        document.getElementById("error-message").textContent = error;
      }
    } catch (error) {
      console.error("Error connecting to the API:", error);
      document.getElementById("error-message").textContent =
        "An error occurred. Please try again.";
    }
  });
