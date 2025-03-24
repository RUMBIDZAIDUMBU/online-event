// // Handle form submission
// document
//   .getElementById("login-form")
//   .addEventListener("submit", async (event) => {
//     event.preventDefault(); // Prevent form from submitting normally

//     const username = document.getElementById("userName").value;
//     const password = document.getElementById("password").value;

//     console.log("username: " + username);
//     console.log("password: " + password);

//     // Basic validation (example: username = admin, password = 1234)
//     try {
//       // Send POST request to Spring Boot API

//       const requestBody = JSON.stringify({ userName: username, password }); // Send username and password as JSON

//       console.log(requestBody);

//       const response = await fetch(
//         "http://localhost:8080/api/ticketing/authenticate",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },

//           body: requestBody,
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         // Store token in sessionStorage
//         sessionStorage.setItem("authToken", data.token);
//         // Optionally, redirect to another page
//         window.location.href = "/admins/index.html";
//       } else {
//         const error = await response.text();
//         document.getElementById("error-message").textContent = error;
//       }
//     } catch (error) {
//       console.error("Error connecting to the API:", error);
//       document.getElementById("error-message").textContent =
//         "An error occurred. Please try again.";
//     }
//   });
// Show loading screen initially
// Hide loading screen initially and show login form

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");
  const loginBtn = document.getElementById("login-btn");
  const resetPasswordForm = document.getElementById("reset-password-form");
  const resetMessage = document.getElementById("reset-message");
  const resetPasswordModal = new bootstrap.Modal(
    document.getElementById("resetPasswordModal")
  );

  // Initialize particles.js
  particlesJS("particles-js", {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: "#4fbdba" }, // Brand color for particles
      shape: {
        type: "circle",
        stroke: { width: 0, color: "#000000" },
        polygon: { nb_sides: 5 },
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
      },
      size: {
        value: 3,
        random: true,
        anim: { enable: false, speed: 40, size_min: 0.1, sync: false },
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#67d4d1", // Lighter brand color for lines
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: { enable: false, rotateX: 600, rotateY: 1200 },
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: true, mode: "push" },
        resize: true,
      },
      modes: {
        grab: { distance: 400, line_linked: { opacity: 1 } },
        bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
        repulse: { distance: 100, duration: 0.4 },
        push: { particles_nb: 4 },
        remove: { particles_nb: 2 },
      },
    },
    retina_detect: true,
  });

  function showLoadingAnimation(callback) {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.classList.add("active");
    setTimeout(() => {
      loadingScreen.classList.remove("active");
      if (callback) callback();
    }, 1500);
  }

  function resetUI() {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.classList.remove("active");
    loginBtn.textContent = "Login";
    loginBtn.disabled = false;
    errorMessage.style.display = "none";
    errorMessage.textContent = "";
    loginForm.classList.remove("was-validated");
  }

  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      showLoadingAnimation(() => {
        resetUI();
      });
    } else {
      showLoadingAnimation(() => {
        resetUI();
      });
    }
  });

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const form = e.target;

    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add("was-validated");
      return;
    }

    const username = document.getElementById("userName").value;
    const password = document.getElementById("password").value;

    errorMessage.style.display = "none";
    loginBtn.textContent = "Logging in...";
    loginBtn.disabled = true;

    setTimeout(() => {
      if (username === "admin" && password === "password123") {
        showLoadingAnimation(() => {
          window.location.href = "/Assets/Pages/admins/index.html";
        });
      } else {
        errorMessage.textContent = "Invalid username or password";
        errorMessage.style.display = "block";
        loginBtn.textContent = "Login";
        loginBtn.disabled = false;
      }
    }, 500);
  });

  resetPasswordForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const form = e.target;

    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add("was-validated");
      return;
    }

    const email = document.getElementById("reset-email").value;
    resetMessage.textContent = "Sending reset link...";
    resetMessage.style.color = "#4fbdba";

    setTimeout(() => {
      resetMessage.textContent = `A password reset link has been sent to ${email}.`;
      form.reset();
      form.classList.remove("was-validated");
    }, 1500);
  });

  // Reset the modal when it closes
  resetPasswordModal._element.addEventListener("hidden.bs.modal", () => {
    resetPasswordForm.reset();
    resetMessage.textContent = "";
    resetPasswordForm.classList.remove("was-validated");
  });

  document.querySelectorAll("a:not(.forgot-password)").forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href !== "#") {
        e.preventDefault();
        showLoadingAnimation(() => {
          window.location.href = href;
        });
      }
    });
  });
});
