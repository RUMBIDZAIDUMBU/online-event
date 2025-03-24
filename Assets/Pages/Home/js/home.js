document.addEventListener("DOMContentLoaded", async () => {
  // Initialize cart from cartManager (assuming it exists globally)
  let cart = window.cartManager ? window.cartManager.getCart() : [];
  const eventContainer = document.getElementById("eventCards"); // Updated ID to match new version
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
      color: { value: "#67d4d1" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#4fbdba",
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

  // Fetch events from API
  let events = [];
  try {
    const response = await fetch(
      "http://localhost:8080/api/ticketing/ticket/banner/active-tickets",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`);
    }

    const ticketList = await response.json();
    events = await Promise.all(
      ticketList.map(async (ticket) => {
        const imageUrl = await getEventImage(ticket.id);
        return {
          id: ticket.id, // Added for API reference
          title: ticket.title,
          description: ticket.description,
          date: ticket.date || "TBD", // Assuming API might provide this
          weekday:
            ticket.weekday ||
            new Date(ticket.date)
              .toLocaleString("en-us", { weekday: "long" })
              .toLowerCase(),
          eventType: ticket.eventType || "festival", // Default if not provided
          category: ticket.category || "culture", // Default if not provided
          location: ticket.location || "TBD",
          earlyBirdPrice: ticket.earlyBirdPrice || 20, // Default prices
          vipPrice: ticket.vipPrice || 50,
          generalPrice: ticket.generalPrice || 30,
          imageUrl: imageUrl,
        };
      })
    );

    renderEvents(events);
    updateCartDisplay();
  } catch (error) {
    console.error("Error fetching events:", error);
    eventContainer.innerHTML =
      "<p>Failed to load events. Please try again later.</p>";
  }

  // Fetch event image from API
  async function getEventImage(ticketId) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/ticketing/image/get-image?ticketId=${ticketId}`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error fetching image:", error);
      return "../event/img/default.png";
    }
  }

  // Update cart display
  function updateCartDisplay() {
    cart = window.cartManager ? window.cartManager.getCart() : cart;
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
        if (window.cartManager) window.cartManager.removeFromCart(index);
        else cart.splice(index, 1); // Fallback if cartManager isn't available
        updateCartDisplay();
      });
    });
  }

  // Render events
  function renderEvents(filteredEvents) {
    eventContainer.innerHTML = "";
    filteredEvents.forEach((event, index) => {
      const eventCard = `
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-lg">
            <img src="${event.imageUrl}" class="card-img-top" alt="${event.title}" />
            <div class="card-body">
              <h5 class="card-title">${event.title}</h5>
              <p class="card-text"><strong>Description:</strong> ${event.description}</p>
              <p class="card-text"><strong>Date:</strong> ${event.date}</p>
              <p class="card-text"><strong>Location:</strong> ${event.location}</p>
              <p class="card-text"><strong>Early Bird Price:</strong> $${event.earlyBirdPrice}</p>
              <p class="card-text"><strong>VIP Price:</strong> $${event.vipPrice}</p>
              <p class="card-text"><strong>General Price:</strong> $${event.generalPrice}</p>
            </div>
            <div class="card-footer">
              <div class="d-grid">
                <button class="btn btn-primary buy-ticket" data-index="${index}">Buy Ticket</button>
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
        ).textContent = `Date: ${selectedEvent.date}`;
        document.getElementById(
          "modalEventLocation"
        ).textContent = `Location: ${selectedEvent.location}`;
        updateTotalPrice();
        ticketModal.show();
      });
    });
  }

  // Filter events
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

  // Event listeners for filters
  document
    .getElementById("weekdaysFilter")
    ?.addEventListener("change", filterEvents);
  document
    .getElementById("eventTypeFilter")
    ?.addEventListener("change", filterEvents);
  document
    .getElementById("categoryFilter")
    ?.addEventListener("change", filterEvents);

  // Update total price in modal
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

  document
    .getElementById("ticketType")
    ?.addEventListener("change", updateTotalPrice);
  document
    .getElementById("ticketQuantity")
    ?.addEventListener("input", updateTotalPrice);

  // Add to cart
  document.getElementById("addToCart")?.addEventListener("click", function () {
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

    if (window.cartManager) window.cartManager.addToCart(cartItem);
    else cart.push(cartItem); // Fallback if cartManager isn't available
    updateCartDisplay();
    ticketModal.hide();
  });

  // Checkout
  document.getElementById("checkout")?.addEventListener("click", function () {
    cart = window.cartManager ? window.cartManager.getCart() : cart;
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

  // Navigation and footer link animations
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href !== "#" && !href.includes("modal")) {
        e.preventDefault();
        showLoadingAnimation(() => (window.location.href = href));
      }
    });
  });

  document.querySelectorAll(".footer-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href !== "#" && !href.includes("modal")) {
        e.preventDefault();
        showLoadingAnimation(() => (window.location.href = href));
      }
    });
  });
});
