document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("event-form");
  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");
  const dateInput = document.getElementById("date");
  const locationInput = document.getElementById("location");
  const earlyBirdPriceInput = document.getElementById("early-bird-price");
  const vipPriceInput = document.getElementById("vip-price");
  const generalPriceInput = document.getElementById("general-price");
  // const bannerInput = document.getElementById("banner");

  const successMessage = document.getElementById("success-message");
  const errorMessage = document.getElementById("error-message");

  let ticketId = null; // To store the ticket ID if editing

  // Check if editing an existing ticket
  const ticketData = sessionStorage.getItem("editTicket");

  console.log(ticketData);

  let ticket = null;

  if (ticketData) {
    ticket = JSON.parse(ticketData);
    ticketId = ticket.id; // Store ticket ID

    // Pre-fill form fields
    titleInput.value = ticket.title;
    descriptionInput.value = ticket.description;
    dateInput.value = ticket.date;
    locationInput.value = ticket.location;
    earlyBirdPriceInput.value = ticket.earlyBirdPrice;
    vipPriceInput.value = ticket.vipPrice;
    generalPriceInput.value = ticket.generalPrice;
    sessionStorage.removeItem("editTicket"); // Clear after loading
  }

  // Handle form submission
  form.addEventListener("submit", async (event) => {
    console.log("button clicked");

    event.preventDefault();

    console.log("1");
    const token = sessionStorage.getItem("authToken");
    console.log("2");
    if (!token) {
      alert("You must be logged in.");
      return;
    }
    console.log("3");
    if (
      !titleInput.value.trim() ||
      !descriptionInput.value.trim() ||
      !dateInput.value ||
      !locationInput.value.trim() ||
      isNaN(parseFloat(earlyBirdPriceInput.value)) ||
      isNaN(parseFloat(vipPriceInput.value)) ||
      isNaN(parseFloat(generalPriceInput.value))
    ) {
      alert("All fields are required!");
      return;
    }
    console.log("4");
    const reader = new FileReader();
    console.log("5");

    // reader.onload = async function (event) {
    console.log("6");
    // const bannerURL = event.target.result;

    // // Prepare ticket object
    const ticketDetails = ticketId
      ? {
          ...ticket, // Preserve existing values
          title: titleInput.value.trim(),
          description: descriptionInput.value.trim(),
          date: dateInput.value,
          location: locationInput.value.trim(),
          earlyBirdPrice: parseFloat(earlyBirdPriceInput.value),
          vipPrice: parseFloat(vipPriceInput.value),
          generalPrice: parseFloat(generalPriceInput.value),
        }
      : {
          title: titleInput.value.trim(),
          description: descriptionInput.value.trim(),
          date: dateInput.value,
          location: locationInput.value.trim(),
          earlyBirdPrice: parseFloat(earlyBirdPriceInput.value),
          vipPrice: parseFloat(vipPriceInput.value),
          generalPrice: parseFloat(generalPriceInput.value),
          // banner: bannerURL, // Only include banner for new tickets
        };

    // const ticketDetails = {
    //   title: titleInput.value.trim(),
    //   description: descriptionInput.value.trim(),
    //   date: dateInput.value,
    //   location: locationInput.value.trim(),
    //   earlyBirdPrice: parseFloat(earlyBirdPriceInput.value),
    //   vipPrice: parseFloat(vipPriceInput.value),
    //   generalPrice: parseFloat(generalPriceInput.value),
    // };
    console.log("7");
    // const url = ticketId
    //   ? `http://localhost:8080/api/ticketing/ticket/update/${ticketId}`
    //   : "http://localhost:8080/api/ticketing/ticket/create";

    const url = "http://localhost:8080/api/ticketing/ticket/create";

    // const method = ticketId ? "PUT" : "POST"; // Determine HTTP method

    // console.log(method);
    console.log(url);

    console.log("data", JSON.stringify(ticketDetails));

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ticketDetails),
      });

      if (!response.ok) {
        throw new Error("Failed to save ticket.");
      }

      successMessage.style.display = "block";
      errorMessage.style.display = "none";
      sessionStorage.removeItem("editTicket"); // Clear after submission

      setTimeout(() => {
        window.location.href = "/create-list/index.html"; // Redirect after success
      }, 1500);
    } catch (error) {
      console.error("Error saving ticket:", error);
      successMessage.style.display = "none";
      errorMessage.style.display = "block";
    }
    // };

    // reader.onerror = function () {
    //   alert("Error reading file. Please try again.");
    // };

    // if (!ticketId) {
    // Read banner only if it's a new ticket
    //   reader.readAsDataURL(bannerInput.files[0]);
    // } else {
    // If updating, proceed without reading a new banner
    //   reader.onload({ target: { result: ticket.banner || "" } });
    // }
  });
});
