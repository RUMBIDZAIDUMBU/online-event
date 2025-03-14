document.addEventListener("DOMContentLoaded", async () => {
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
    const eventsContainer = document.getElementById("featuredEvents");

    for (const ticket of ticketList) {
      console.log("Getting ticket ..", ticket);
      const imageUrl = await getEventImage(ticket.id);

      const eventCard = `
              <div class="col-md-4 mb-4">
                <div class="card">
                  <img src="${imageUrl}" class="card-img-top" alt="${
        ticket.title
      }" />
                  <div class="card-body">
                    <h5 class="card-title">${ticket.title}</h5>
                    <p class="card-text">${ticket.description}</p>
                    <button class="btn btn-primary view-detail-btn" 
        data-ticket='${JSON.stringify(ticket)}'>View Detail</button>

            

                  </div>
                </div>
              </div>
            `;
      eventsContainer.innerHTML += eventCard;
    }
  } catch (error) {
    // console.error("Error fetching events:", error);
  }

  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("view-detail-btn")) {
      const ticketData = JSON.parse(event.target.getAttribute("data-ticket"));

      console.log("ticket data in list", ticketData); // Should be the full object

      sessionStorage.setItem("ticketData", JSON.stringify(ticketData));

      window.location.href = "banner-details/index.html";
    }
  });
});

async function getEventImage(ticketId) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/ticketing/image/get-image?ticketId=${ticketId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const blob = await response.blob();
    console.log("Generated Image URL:", URL.createObjectURL(blob));

    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error fetching image:", error);
    return "../event/img/default.png";
  }
}
