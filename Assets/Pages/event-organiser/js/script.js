document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen");

  // Show loading screen on page load
  loadingScreen.classList.add("active");
  setTimeout(() => {
    loadingScreen.classList.remove("active");
  }, 1000);

  // Initialize Particles.js
  particlesJS("particles-js", {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: "#4fbdba" }, // Teal to match theme
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
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
        repulse: { distance: 100, duration: 0.4 },
        push: { particles_nb: 4 },
      },
    },
    retina_detect: true,
  });

  // Form Submission
  const form = document.getElementById("add-admin-form");
  const formMessage = document.getElementById("formMessage");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    if (password !== confirmPassword) {
      formMessage.textContent = "Passwords do not match!";
      formMessage.className = "form-message error";
      return;
    }
    formMessage.textContent = "Admin added successfully!";
    formMessage.className = "form-message success";
    form.reset();
  });

  // Cart Modal Update
  const cartModal = document.getElementById("cartModal");
  if (!window.cartManager) {
    console.error("cartManager not found. Ensure cart.js is loaded first.");
    return;
  }
  cartModal.addEventListener("show.bs.modal", () => {
    window.cartManager.updateCartUI();
    updateCartModal();
  });

  function updateCartModal() {
    const cart = window.cartManager.getCart();
    const cartItems = document.getElementById("cartItems");
    const totalTickets = document.getElementById("cartTotalTickets");
    const totalAmount = document.getElementById("cartTotalAmount");

    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const totalPrice = cart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );

    cartItems.innerHTML =
      cart.length > 0
        ? cart
            .map(
              (item, index) => `
          <div class="cart-item">
            <img src="${
              item.imageUrl || "/Assets/images/default-ticket.jpg"
            }" alt="${item.title}">
            <div class="cart-item-details">
              <h6>${item.title}</h6>
              <p>${item.quantity || 1} x $${(item.price || 0).toFixed(2)}</p>
            </div>
            <button class="delete-btn" data-index="${index}"><i class="bi bi-trash"></i></button>
          </div>
        `
            )
            .join("")
        : "<p>Your cart is empty</p>";

    totalTickets.textContent = totalQty;
    totalAmount.textContent = totalPrice.toFixed(2);

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"));
        window.cartManager.removeFromCart(index);
        updateCartModal();
      });
    });
  }

  // Routing with Loading Animation
  function handleRouting(e) {
    const link = e.target.closest("a[href]");
    if (!link || link.getAttribute("data-bs-toggle") === "modal") return;
    e.preventDefault();
    loadingScreen.classList.add("active");
    setTimeout(() => {
      window.location.href = link.href;
    }, 500);
  }

  document.querySelectorAll(".nav-link, .footer-link").forEach((link) => {
    link.addEventListener("click", handleRouting);
  });

  document.getElementById("checkout").addEventListener("click", (e) => {
    const cart = window.cartManager.getCart();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    loadingScreen.classList.add("active");
    setTimeout(() => {
      window.location.href = "/Assets/Pages/payment/index.html";
    }, 500);
  });

  // Initial UI Update
  window.cartManager.updateCartUI();
});
