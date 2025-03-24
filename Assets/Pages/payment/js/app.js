document.addEventListener("DOMContentLoaded", () => {
  let cart = [];
  const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
  const urlParams = new URLSearchParams(window.location.search);

  // Load cart from URL parameters or localStorage
  cart = JSON.parse(decodeURIComponent(urlParams.get("items") || "[]"));
  let total = parseFloat(urlParams.get("total") || "0");

  if (cart.length === 0) {
    cart = window.cartManager.getCart();
    total = cart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );
  } else {
    window.cartManager.clearCart();
    cart.forEach((item) => window.cartManager.addToCart(item));
  }

  // Show loading animation
  function showLoadingAnimation(callback) {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.classList.add("active");
    setTimeout(() => {
      loadingScreen.classList.remove("active");
      if (callback) callback();
    }, 1500);
  }

  // Reset UI after loading or payment
  function resetUI() {
    const loadingScreen = document.getElementById("loading-screen");
    const paymentBtn = document.getElementById("payment-btn");
    const errorMessage = document.getElementById("error-message");
    const form = document.getElementById("payment-form");

    loadingScreen.classList.remove("active");
    paymentBtn.textContent = "Checkout";
    paymentBtn.disabled = false;
    errorMessage.style.display = "none";
    errorMessage.textContent = "";
    form.classList.remove("was-validated");
  }

  // Update cart display in summary and modal
  function updateCartDisplay() {
    const cartItems = document.getElementById("cartItems");
    const cartTotalTickets = document.getElementById("cartTotalTickets");
    const formTotalAmount = document.getElementById("formTotalAmount");
    const modalCartItems = document.getElementById("modalCartItems");
    const modalTotalTickets = document.getElementById("modalTotalTickets");
    const modalTotalAmount = document.getElementById("modalTotalAmount");

    const totalQuantity = cart.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
    total = cart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );

    cartTotalTickets.textContent = totalQuantity;
    formTotalAmount.textContent = total.toFixed(2);
    modalTotalTickets.textContent = totalQuantity;
    modalTotalAmount.textContent = total.toFixed(2);

    const cartHTML =
      cart
        .map(
          (item, index) => `
            <div class="cart-item">
              <img src="${item.imageUrl}" alt="${item.title}">
              <div class="cart-item-details">
                <h6>${item.title} (${item.ticketType})</h6>
                <p>${item.quantity} @ $${item.price.toFixed(2)}</p>
              </div>
              <button class="delete-btn" data-index="${index}"><i class="bi bi-trash"></i></button>
            </div>
          `
        )
        .join("") || "<p>Your cart is empty</p>";

    cartItems.innerHTML = cartHTML;
    modalCartItems.innerHTML = cartHTML;

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        const itemElement = this.parentElement;
        itemElement.classList.add("delete");
        setTimeout(() => {
          window.cartManager.removeFromCart(index);
          cart = window.cartManager.getCart();
          updateCartDisplay();
        }, 300);
      });
    });

    window.cartManager.updateCartUI();
  }

  // Warn on unsaved changes
  let cartModified = false;
  window.addEventListener("beforeunload", (e) => {
    if (cartModified && cart.length > 0) {
      e.preventDefault();
      e.returnValue =
        "You have unsaved changes in your cart. Are you sure you want to leave?";
    }
  });

  // Handle page load and browser navigation
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      showLoadingAnimation(() => {
        resetUI();
        updateCartDisplay();
      });
    } else {
      showLoadingAnimation(() => {
        resetUI();
        updateCartDisplay();
      });
    }
  });

  // Simulate EcoCash payment API call
  async function processEcoCashPayment(phone, amount, email) {
    // Simulated API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          // 90% success rate for simulation
          resolve({
            status: "success",
            transactionId: `TXN-${Math.random()
              .toString(36)
              .substr(2, 9)
              .toUpperCase()}`,
          });
        } else {
          reject(new Error("Payment failed due to network issues."));
        }
      }, 2000);
    });
  }

  // Handle form submission
  document
    .getElementById("payment-form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      const form = e.target;
      const email = document.getElementById("email").value;
      const confirmEmail = document.getElementById("confirm-email").value;
      const phone = document.getElementById("phone").value;
      const paymentBtn = document.getElementById("payment-btn");
      const errorMessage = document.getElementById("error-message");

      if (email !== confirmEmail) {
        document
          .getElementById("confirm-email")
          .setCustomValidity("Emails do not match.");
      } else {
        document.getElementById("confirm-email").setCustomValidity("");
      }

      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add("was-validated");
        return;
      }

      if (cart.length === 0) {
        errorMessage.textContent = "Your cart is empty.";
        errorMessage.style.display = "block";
        return;
      }

      errorMessage.style.display = "none";
      paymentBtn.textContent = "Processing...";
      paymentBtn.disabled = true;

      try {
        const paymentResult = await processEcoCashPayment(phone, total, email);
        showLoadingAnimation(() => {
          const ticketIds = cart.map(
            () =>
              `TICKET-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          );
          alert(
            `Purchase successful!\nPayment Method: ECOCASH\nTransaction ID: ${
              paymentResult.transactionId
            }\nTicket IDs: ${ticketIds.join(", ")}\nDetails sent to ${email}`
          );
          window.cartManager.clearCart();
          cart = [];
          cartModified = false;
          form.reset();
          window.location.href = "/index.html";
        });
      } catch (error) {
        errorMessage.textContent =
          error.message || "Payment failed. Please try again.";
        errorMessage.style.display = "block";
        paymentBtn.textContent = "Checkout";
        paymentBtn.disabled = false;
      }
    });

  // Navigation with loading animation
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href !== "#" && !href.includes("modal")) {
        e.preventDefault();
        cartModified = true;
        showLoadingAnimation(() => {
          window.location.href = href;
        });
      }
    });
  });

  document
    .querySelector(".btn-continue-shopping")
    .addEventListener("click", function (e) {
      e.preventDefault();
      cartModified = true;
      showLoadingAnimation(() => {
        window.location.href = "/index.html";
      });
    });

  document
    .getElementById("modalCheckout")
    .addEventListener("click", function () {
      cartModal.hide();
      cartModified = true;
      showLoadingAnimation(() => {
        window.location.href = "/index.html";
      });
    });

  // Initial cart display update
  updateCartDisplay();
});
