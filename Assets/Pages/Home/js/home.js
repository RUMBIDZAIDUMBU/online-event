document.addEventListener("DOMContentLoaded", () => {
  const events = [
    {
      title: "Harare International Festival of the Arts (HIFA)",
      description: "Zimbabwe's premier arts and culture festival.",
      date: "2025-04-28",
      weekday: "friday",
      eventType: "festival",
      category: "culture",
      location: "Harare Gardens, Harare",
      earlyBirdPrice: 20,
      vipPrice: 50,
      generalPrice: 30,
      imageUrl:
        "https://img.freepik.com/free-vector/sporting-event-poster-2021-with-photo_52683-41077.jpg?ga=GA1.1.836145345.1742459530&semt=ais_hybrid",
    },
    {
      title: "Zim Afro T10 Cricket Tournament",
      description: "Fast-paced cricket action featuring international stars.",
      date: "2025-07-20",
      weekday: "sunday",
      eventType: "sports",
      category: "sports",
      location: "Harare Sports Club, Harare",
      earlyBirdPrice: 15,
      vipPrice: 40,
      generalPrice: 25,
      imageUrl:
        "https://img.freepik.com/free-vector/sporting-event-poster-2021-with-photo_52683-41077.jpg?ga=GA1.1.836145345.1742459530&semt=ais_hybrid",
    },
    {
      title: "Chimanimani Arts Festival",
      description: "A celebration of arts in the scenic Eastern Highlands.",
      date: "2025-09-12",
      weekday: "saturday",
      eventType: "festival",
      category: "culture",
      location: "Chimanimani, Manicaland",
      earlyBirdPrice: 10,
      vipPrice: 30,
      generalPrice: 20,
      imageUrl:
        "https://img.freepik.com/free-psd/flat-design-music-festival-template_23-2149340666.jpg?ga=GA1.1.836145345.1742459530&semt=ais_hybrid",
    },
    {
      title: "Mapopoma Festival",
      description: "Victoria Falls Music Festival.",
      date: "2025-12-31",
      weekday: "wednesday",
      eventType: "festival",
      category: "music",
      location: "Victoria Falls",
      earlyBirdPrice: 50,
      vipPrice: 100,
      generalPrice: 75,
      imageUrl:
        "https://img.freepik.com/free-psd/flat-design-music-festival-template_23-2149340666.jpg?ga=GA1.1.836145345.1742459530&semt=ais_hybrid",
    },
  ];

  // Use cartManager to manage the cart state
  let cart = window.cartManager.getCart();
  const eventContainer = document.getElementById("eventCards");
  const ticketModal = new bootstrap.Modal(
    document.getElementById("ticketModal")
  );
  const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
  let selectedEvent;

  // Loading Animation Function
  function showLoadingAnimation(callback) {
    const loadingScreen = document.getElementById("loading-screen");
    console.log("Showing loading animation");
    loadingScreen.classList.add("active");
    setTimeout(() => {
      console.log("Hiding loading animation");
      loadingScreen.classList.remove("active");
      if (callback) callback();
    }, 1500); // 1.5-second animation
  }

  // Initialize Particles.js
  particlesJS("particles-js", {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: "#67d4d1" }, // Brand brighter teal
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#4fbdba", // Brand teal
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

  function renderEvents(filteredEvents) {
    eventContainer.innerHTML = "";
    filteredEvents.forEach((event, index) => {
      const eventCard = `
              <div class="col-md-6 col-lg-4">
                <div class="card shadow-lg">
                  <img src="${event.imageUrl}" class="card-img-top" alt="${event.title}" />
                  <div class="card-body">
                    <h5 class="card-title">${event.title}</h5>
                    <p class="card-text">
                      <strong>Description:</strong> ${event.description}
                    </p>
                    <p class="card-text"><strong>Date:</strong> ${event.date}</p>
                    <p class="card-text">
                      <strong>Location:</strong> ${event.location}
                    </p>
                    <p class="card-text">
                      <strong>Early Bird Price:</strong> $${event.earlyBirdPrice}
                    </p>
                    <p class="card-text">
                      <strong>VIP Price:</strong> $${event.vipPrice}
                    </p>
                    <p class="card-text">
                      <strong>General Price:</strong> $${event.generalPrice}
                    </p>
                  </div>
                  <div class="card-footer">
                    <div class="d-grid">
                      <button
                        class="btn btn-primary buy-ticket"
                        data-index="${index}"
                      >
                        Buy Ticket
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            `;
      eventContainer.innerHTML += eventCard;
    });

    document.querySelectorAll(".buy-ticket").forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        const index = parseInt(this.getAttribute("data-index"));
        selectedEvent = filteredEvents[index];
        document.getElementById("modalEventTitle").textContent =
          selectedEvent.title;
        document.getElementById("modalEventDescription").textContent =
          selectedEvent.description;
        document.getElementById(
          "modalEventDate"
        ).textContent = `Date: ${event.date}`;
        document.getElementById(
          "modalEventLocation"
        ).textContent = `Location: ${event.location}`;
        updateTotalPrice();
        ticketModal.show();
      });
    });
  }

  function filterEvents() {
    const weekday = document.getElementById("weekdaysFilter").value;
    const eventType = document.getElementById("eventTypeFilter").value;
    const category = document.getElementById("categoryFilter").value;

    const filteredEvents = events.filter((event) => {
      return (
        (!weekday || event.weekday === weekday) &&
        (!eventType || event.eventType === eventType) &&
        (!category || event.category === category)
      );
    });

    renderEvents(filteredEvents);
  }

  document
    .getElementById("weekdaysFilter")
    .addEventListener("change", filterEvents);
  document
    .getElementById("eventTypeFilter")
    .addEventListener("change", filterEvents);
  document
    .getElementById("categoryFilter")
    .addEventListener("change", filterEvents);

  renderEvents(events);

  document
    .getElementById("ticketType")
    .addEventListener("change", updateTotalPrice);
  document
    .getElementById("ticketQuantity")
    .addEventListener("input", updateTotalPrice);

  function updateTotalPrice() {
    const type = document.getElementById("ticketType").value;
    const quantity =
      parseInt(document.getElementById("ticketQuantity").value) || 1;
    let price = 0;

    if (type === "general") price = selectedEvent.generalPrice;
    else if (type === "earlyBird") price = selectedEvent.earlyBirdPrice;
    else if (type === "vip") price = selectedEvent.vipPrice;

    document.getElementById("totalPrice").textContent = (
      price * quantity
    ).toFixed(2);
  }

  document.getElementById("addToCart").addEventListener("click", function () {
    const ticketType = document.getElementById("ticketType").value;
    const quantity =
      parseInt(document.getElementById("ticketQuantity").value) || 1;
    let price = 0;

    if (ticketType === "general") price = selectedEvent.generalPrice;
    else if (ticketType === "earlyBird") price = selectedEvent.earlyBirdPrice;
    else if (ticketType === "vip") price = selectedEvent.vipPrice;

    const cartItem = {
      title: selectedEvent.title,
      ticketType: ticketType,
      quantity: quantity,
      price: price,
      imageUrl: selectedEvent.imageUrl,
    };

    window.cartManager.addToCart(cartItem); // Save to localStorage
    updateCartDisplay();
    ticketModal.hide();
  });

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

  // Add Routing Animation to Navigation Links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href !== "#" && !href.includes("modal")) {
        // Exclude modal links
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

  // Initial cart display update
  updateCartDisplay();
});
