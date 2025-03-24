document.addEventListener("DOMContentLoaded", () => {
  console.log("about.js loaded");

  function showLoadingAnimation(callback) {
    const loadingScreen = document.getElementById("loading-screen");
    if (!loadingScreen) {
      console.error("Loading screen element not found.");
      if (callback) callback();
      return;
    }
    loadingScreen.classList.add("active");
    setTimeout(() => {
      loadingScreen.classList.remove("active");
      if (callback) callback();
    }, 1500);
  }

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href !== "#" && !href.includes("modal")) {
        e.preventDefault();
        showLoadingAnimation(() => {
          window.location.href = href;
        });
      }
    });
  });

  if (!window.cartManager) {
    console.error("cartManager is not available. Ensure cart.js is loaded.");
    return;
  }

  const cartModal = document.getElementById("cartModal");
  if (!cartModal) {
    console.error("Cart modal element not found.");
    return;
  }

  cartModal.addEventListener("show.bs.modal", () => {
    console.log("Modal opening, updating cart...");
    window.cartManager.updateCartUI();
    updateCartModal();
  });

  function updateCartModal() {
    const cart = window.cartManager.getCart();
    const cartItems = document.getElementById("cartItems");
    const cartTotalTickets = document.getElementById("cartTotalTickets");
    const cartTotalAmount = document.getElementById("cartTotalAmount");

    console.log("Cart data:", cart);
    console.log("Elements:", { cartItems, cartTotalTickets, cartTotalAmount });

    if (!cartItems || !cartTotalTickets || !cartTotalAmount) {
      console.error("Cart modal elements not found.");
      return;
    }

    const totalQuantity = cart.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
    const totalAmount = cart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );

    cartTotalTickets.textContent = totalQuantity;
    cartTotalAmount.textContent = totalAmount.toFixed(2);

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

    console.log("Generated HTML:", cartHTML);
    cartItems.innerHTML = cartHTML;

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        const itemElement = this.parentElement;
        itemElement.classList.add("delete");
        setTimeout(() => {
          window.cartManager.removeFromCart(index);
          updateCartModal();
          window.cartManager.updateCartUI();
        }, 300);
      });
    });
  }

  document.getElementById("checkout").addEventListener("click", () => {
    const cart = window.cartManager.getCart();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    const total = cart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );
    const items = encodeURIComponent(JSON.stringify(cart));
    showLoadingAnimation(() => {
      window.location.href = `/Assets/Pages/payment/index.html?items=${items}&total=${total}`;
    });
  });

  window.cartManager.updateCartUI();
});
