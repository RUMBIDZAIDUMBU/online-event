// Shared Cart Management Script
(function () {
  // Initialize cart state in localStorage if it doesn't exist
  function initializeCart() {
    if (!localStorage.getItem("cart")) {
      localStorage.setItem("cart", JSON.stringify([]));
    }
  }

  // Function to get the cart from localStorage
  function getCart() {
    try {
      const cart = JSON.parse(localStorage.getItem("cart"));
      return Array.isArray(cart) ? cart : [];
    } catch (e) {
      console.error("Error reading cart from localStorage:", e);
      return [];
    }
  }

  // Function to save the cart to localStorage
  function saveCart(cart) {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartUI();
    } catch (e) {
      console.error("Error saving cart to localStorage:", e);
    }
  }

  // Function to add an item to the cart
  function addToCart(item) {
    const cart = getCart();
    cart.push(item);
    saveCart(cart);
  }

  // Function to remove an item from the cart by index
  function removeFromCart(index) {
    const cart = getCart();
    if (index >= 0 && index < cart.length) {
      cart.splice(index, 1);
      saveCart(cart);
    }
  }

  // Function to clear the cart (e.g., after checkout)
  function clearCart() {
    saveCart([]);
  }

  // Function to update the cart UI (cart count, active state) in the navbar
  function updateCartUI() {
    const cart = getCart();
    const totalQuantity = cart.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );

    // Select navbar cart elements
    const cartCountElement = document.querySelector("#cartCount");
    const cartLink = document.querySelector(".cart-link");
    const cartIcon = document.querySelector(".cart-icon");

    // Update cart count in the navbar
    if (cartCountElement) {
      cartCountElement.textContent = totalQuantity;
    } else {
      console.warn("Cart count element (#cartCount) not found in the DOM.");
    }

    // Update active state for cart link and icon
    if (cartLink && cartIcon) {
      if (totalQuantity > 0) {
        cartLink.classList.add("active");
        cartIcon.classList.add("active");
      } else {
        cartLink.classList.remove("active");
        cartIcon.classList.remove("active");
      }
    } else {
      console.warn(
        "Cart link (.cart-link) or cart icon (.cart-icon) not found in the DOM."
      );
    }
  }

  // Initialize cart on script load
  initializeCart();

  // Update cart UI on page load
  document.addEventListener("DOMContentLoaded", () => {
    updateCartUI();
  });

  // Expose functions to the global scope for use in other scripts
  window.cartManager = {
    getCart,
    saveCart,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartUI,
  };
})();
