document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");
  const loginBtn = document.getElementById("login-btn");
  const resetPasswordForm = document.getElementById("reset-password-form");
  const resetMessage = document.getElementById("reset-message");
  const resetPasswordModal = new bootstrap.Modal(
    document.getElementById("resetPasswordModal")
  );
  const loadingScreen = document.getElementById("loading-screen");

  // Initialize Particles.js
  if (window.particlesJS) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#4fbdba" },
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
          color: "#67d4d1",
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
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: { distance: 100, duration: 0.4 },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 },
        },
      },
      retina_detect: true,
    });
  }

  // Loading animation function
  function showLoadingAnimation(callback) {
    if (loadingScreen) {
      loadingScreen.classList.add("active");
      setTimeout(() => {
        loadingScreen.classList.remove("active");
        if (callback) callback();
      }, 500); // Matches routing animation timing
    } else if (callback) {
      callback(); // Proceed without animation if loading screen is missing
    }
  }

  // Reset UI on page load or back navigation
  function resetUI() {
    if (loadingScreen) loadingScreen.classList.remove("active");
    if (loginBtn) {
      loginBtn.textContent = "Login";
      loginBtn.disabled = false;
    }
    if (errorMessage) {
      errorMessage.style.display = "none";
      errorMessage.textContent = "";
    }
    if (loginForm) loginForm.classList.remove("was-validated");
  }

  // Initial page load or back navigation
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      showLoadingAnimation(resetUI);
    } else {
      showLoadingAnimation(resetUI);
    }
  });

  // Handle login form submission
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("userName").value.trim();
    const password = document.getElementById("password").value.trim();

    // Client-side validation
    if (!username || !password) {
      errorMessage.textContent = "Username and password are required.";
      errorMessage.style.display = "block";
      loginForm.classList.add("was-validated");
      return;
    }

    if (loginBtn) {
      loginBtn.textContent = "Logging in...";
      loginBtn.disabled = true;
    }
    errorMessage.style.display = "none";

    console.log("Submitting login request...");
    console.log("Username:", username);
    console.log("Password:", password);

    try {
      const requestBody = JSON.stringify({ userName: username, password });
      console.log("Request Body:", requestBody);

      showLoadingAnimation(); // Show loading screen during API call

      const response = await fetch(
        "http://localhost:8080/api/ticketing/authenticate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful, token received:", data.token);
        sessionStorage.setItem("authToken", data.token);

        // Redirect with animation
        showLoadingAnimation(() => {
          window.location.href = "/Assets/Pages/admins/index.html";
        });
      } else {
        const error = await response.text();
        console.error("Login failed:", error);
        errorMessage.textContent = error || "Invalid username or password.";
        errorMessage.style.display = "block";
        if (loginBtn) {
          loginBtn.textContent = "Login";
          loginBtn.disabled = false;
        }
        if (loadingScreen) loadingScreen.classList.remove("active");
      }
    } catch (error) {
      console.error("Error connecting to the API:", error);
      errorMessage.textContent = "An error occurred. Please try again later.";
      errorMessage.style.display = "block";
      if (loginBtn) {
        loginBtn.textContent = "Login";
        loginBtn.disabled = false;
      }
      if (loadingScreen) loadingScreen.classList.remove("active");
    }
  });

  // Handle reset password form submission
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener("submit", (e) => {
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
  }

  // Reset modal on close
  if (resetPasswordModal) {
    resetPasswordModal._element.addEventListener("hidden.bs.modal", () => {
      resetPasswordForm.reset();
      resetMessage.textContent = "";
      resetPasswordForm.classList.remove("was-validated");
    });
  }

  // Add routing animation to links (excluding forgot password)
  document.querySelectorAll("a:not(.forgot-password)").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href !== "#" && !link.classList.contains("forgot-password")) {
        e.preventDefault();
        showLoadingAnimation(() => {
          window.location.href = href;
        });
      }
    });
  });
});
