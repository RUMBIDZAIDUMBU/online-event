document.addEventListener("DOMContentLoaded", () => {
  // Initialize cart modal
  const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));

  // Cart link shake animation (if cart has items)
  const cartLink = document.querySelector(".cart-link");
  const cartCount = document.getElementById("cartCount");

  // Use cartManager to manage the cart state
  let cart = window.cartManager.getCart();

  function updateCartAnimation() {
    // Use cartManager to get the cart state and calculate total quantity
    cart = window.cartManager.getCart();
    const totalQuantity = cart.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );

    // Update cart count
    if (cartCount) {
      cartCount.textContent = totalQuantity;
    }

    // Update active state for cart link and icon
    if (cartLink) {
      const cartIcon = document.querySelector(".cart-icon");
      if (totalQuantity > 0) {
        cartLink.classList.add("active");
        if (cartIcon) cartIcon.classList.add("active");
      } else {
        cartLink.classList.remove("active");
        if (cartIcon) cartIcon.classList.remove("active");
      }
    }
  }

  // Function to update the cart display in the modal
  function updateCartDisplay() {
    // Sync cart with localStorage
    cart = window.cartManager.getCart();

    const cartCount = document.getElementById("cartCount");
    const cartItems = document.getElementById("cartItems");
    const cartTotalTickets = document.getElementById("cartTotalTickets");
    const cartTotalAmount = document.getElementById("cartTotalAmount");

    const totalQuantity = cart.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
    cartCount.textContent = totalQuantity;
    cartItems.innerHTML =
      cart
        .map(
          (item, index) => `
            <div class="mb-2 p-2 border-bottom cart-item">
              <div class="cart-item-content">
                <img src="${item.imageUrl}" alt="${
            item.title
          }" class="cart-item-image">
                <div>
                  <h6>${item.title} (${item.ticketType})</h6>
                  <p>Quantity: ${item.quantity} | Price: $${item.price.toFixed(
            2
          )} | Total: $${(item.price * item.quantity).toFixed(2)}</p>
                  <button class="btn btn-sm btn-danger remove-item" data-index="${index}">Remove</button>
                </div>
              </div>
            </div>
          `
        )
        .join("") || "<p>Your cart is empty</p>";

    const totalTickets = cart.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
    const totalAmount = cart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );
    cartTotalTickets.textContent = totalTickets;
    cartTotalAmount.textContent = totalAmount.toFixed(2);

    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        window.cartManager.removeFromCart(index); // Update localStorage
        updateCartDisplay();
      });
    });
  }

  // FAQ Data
  const faqData = [
    {
      question: "What kind of contents can I post?",
      answer:
        "You can post event-related content such as live streams, event schedules, promotional materials, and updates. Ensure all content complies with our community guidelines.",
    },
    {
      question: "How can I contribute to Gateway Stream?",
      answer:
        "You can contribute by organizing events, streaming content, or partnering with us as an event organizer. Contact our team through the Event Organiser Accounts page to get started.",
    },
    {
      question: "How can I join the Gateway Stream community?",
      answer:
        "Join our community by signing up as an event organizer or attending events listed on our platform. Follow us on social media for updates and community events.",
    },
    {
      question: "Who can buy event tickets?",
      answer:
        "Anyone can buy event tickets through our platform. Simply browse events, select your ticket, and complete the payment process.",
    },
    {
      question: "Are there risks?",
      answer:
        "As with any online platform, there are risks such as data privacy concerns or event cancellations. We mitigate these by ensuring secure transactions and clear refund policies.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept a variety of payment methods including credit/debit cards, PayPal, and bank transfers. Check the payment page for a full list of options.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, we offer a 14-day free trial for event organizers to explore our platform. Sign up on the Event Organiser Accounts page to get started.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can reach our customer support team via email at support@gatewaystream.com or by phone at +1 (234) 567-890. We’re available 24/7 to assist you.",
    },
  ];

  const faqAccordion = document.getElementById("faqAccordion");

  faqData.forEach((faq, index) => {
    const faqItem = document.createElement("div");
    faqItem.classList.add("faq-card");

    faqItem.innerHTML = `
      <div class="accordion-item">
        <h3 class="accordion-header" id="heading${index}">
          <button
            class="accordion-button ${index === 0 ? "" : "collapsed"}"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapse${index}"
            aria-expanded="${index === 0 ? "true" : "false"}"
            aria-controls="collapse${index}"
          >
            ${faq.question}
          </button>
        </h3>
        <div
          id="collapse${index}"
          class="accordion-collapse collapse ${index === 0 ? "show" : ""}"
          aria-labelledby="heading${index}"
          data-bs-parent="#faqAccordion"
        >
          <div class="accordion-body">
            ${faq.answer}
          </div>
        </div>
      </div>
    `;

    faqAccordion.appendChild(faqItem);
  });

  // Add Routing Animation to Navigation Links
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

  // Add Routing Animation to Footer Links
  document.querySelectorAll(".footer-link").forEach((link) => {
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

  // Handle cart modal display
  if (cartLink) {
    cartLink.addEventListener("click", () => {
      updateCartDisplay();
      cartModal.show();
    });
  }

  // Handle checkout button in cart modal
  document.getElementById("checkout").addEventListener("click", function () {
    cart = window.cartManager.getCart(); // Sync with localStorage
    if (cart.length > 0) {
      const totalAmount = cart.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0
      );
      const totalTickets = cart.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      const paymentUrl = `/Assets/Pages/payment/index.html?items=${encodeURIComponent(
        JSON.stringify(cart)
      )}&total=${totalAmount.toFixed(2)}&tickets=${totalTickets}`;
      showLoadingAnimation(() => {
        window.location.href = paymentUrl;
        cartModal.hide();
      });
    } else {
      alert("Your cart is empty!");
    }
  });

  // Loading Animation Function
  function showLoadingAnimation(callback) {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.classList.add("active");
      setTimeout(() => {
        loadingScreen.classList.remove("active");
        if (callback) callback();
      }, 1500);
    } else {
      if (callback) callback();
    }
  }

  // Initial cart UI update
  updateCartAnimation();
});
