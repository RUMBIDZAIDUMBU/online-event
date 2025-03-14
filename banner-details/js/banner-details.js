document.addEventListener("DOMContentLoaded", async () => {
  // Retrieve ticket data from sessionStorage
  const ticketData = sessionStorage.getItem("ticketData");

  if (ticketData) {
    try {
      const ticket = JSON.parse(ticketData);
      console.log("Ticket Data Retrieved:", ticket);

      // Set event details dynamically
      document.getElementById("eventTitle").textContent = ticket.title || "Event Title Not Available";
      document.getElementById("eventDescription").textContent = ticket.description || "No description available.";
      document.getElementById("eventDate").textContent = ticket.date || "Date not available.";
      document.getElementById("eventLocation").textContent = ticket.location || "Location not specified.";

      // Set ticket prices dynamically
      document.getElementById("generalPrice").textContent = ticket.generalPrice ? `$${ticket.generalPrice}` : "N/A";
      document.getElementById("vipPrice").textContent = ticket.vipPrice ? `$${ticket.vipPrice}` : "N/A";
      document.getElementById("earlyBirdPrice").textContent = ticket.earlyBirdPrice ? `$${ticket.earlyBirdPrice}` : "N/A";

      // Fetch and set the event image
      const imageUrl = await getEventImage(ticket.id);
      document.getElementById("eventImage").src = imageUrl;

    } catch (error) {
      console.error("Error parsing ticket data:", error);
    }
  } else {
    console.warn("No ticket data found in sessionStorage.");
  }
});

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
    console.log("Generated Image URL:", URL.createObjectURL(blob));

    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error fetching image:", error);
    return "../event/img/default.png"; // Fallback image
  }
}

