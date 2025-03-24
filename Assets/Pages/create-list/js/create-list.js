document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("events-table-body");
  if (!tableBody) {
    console.error("Error: Element with ID 'events-table-body' not found.");
    return;
  }

  // Retrieve token from sessionStorage
  const token = sessionStorage.getItem("authToken");

  if (!token) {
    console.error("No token found. User must be authenticated.");
    tableBody.innerHTML =
      "<tr><td colspan='7'>Authentication required</td></tr>";
    window.location.href = "/Assets/Pages/login/index.html"; // Redirect to login
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:8080/api/ticketing/ticket/active-tickets",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        console.error("Token is invalid or expired.");
        sessionStorage.removeItem("authToken");
        window.location.href = "/Assets/Pages/login/index.html"; // Redirect to login
        return;
      }
      throw new Error(`Failed to fetch events: ${response.status}`);
    }

    const ticketList = await response.json();
    console.log("Fetched ticket list:", ticketList);

    tableBody.innerHTML = "";

    ticketList.forEach((ticket) => {
      const row = document.createElement("tr");
      row.classList.add("event-row"); // Added class for styling

      row.innerHTML = `
        <td style="color:#0891b2;">
          <div class="event-info">
            <div>
              <h6 class="event-title">${ticket?.title || "N/A"}</h6>
              <p class="event-date">${ticket?.date || "N/A"}</p>
            </div>
          </div>
        </td>
        <td style="color:#0891b2;">${ticket?.description || "N/A"}</td>
        <td style="color:#0891b2;">${ticket?.location || "N/A"}</td>
        <td style="color:#0891b2;">$${
          ticket?.earlyBirdPrice?.toFixed(2) || "0.00"
        }</td>
        <td style="color:#0891b2;">$${
          ticket?.vipPrice?.toFixed(2) || "0.00"
        }</td>
        <td style="color:#0891b2;">$${
          ticket?.generalPrice?.toFixed(2) || "0.00"
        }</td>
        <td>
          <button class="edit-button" onclick='editTicket(${JSON.stringify(
            ticket
          )})'>Edit</button>
          <button class="delete-button" onclick="deleteTicket('${
            ticket.id
          }')">Delete</button>
          <input type="file" id="file-${
            ticket.id
          }" style="display:none" accept="image/*" onchange="uploadImage(event, '${
        ticket.id
      }')">
          <button class="upload-button" onclick="document.getElementById('file-${
            ticket.id
          }').click()">Upload</button>
        </td>
      `;

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    tableBody.innerHTML = "<tr><td colspan='7'>Error loading data</td></tr>";
  }
});

// Upload Image Function
async function uploadImage(event, ticketId) {
  const token = sessionStorage.getItem("authToken");
  if (!token) {
    alert("Authentication required. Please log in.");
    window.location.href = "/Assets/Pages/login/index.html";
    return;
  }

  const file = event.target.files[0];
  if (!file) {
    alert("Please select an image.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(
      `http://localhost:8080/api/ticketing/image/upload/${ticketId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    alert("Image uploaded successfully!");
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("Error uploading image.");
  }
}

// Edit Ticket Function
function editTicket(ticketData) {
  console.log("Ticket data in list:", ticketData);
  sessionStorage.setItem("editTicket", JSON.stringify(ticketData));
  window.location.href = "/Assets/Pages/create-form/index.html"; // Updated path
}

// Delete Ticket Function
async function deleteTicket(ticketId) {
  const token = sessionStorage.getItem("authToken");
  if (!token) {
    alert("Authentication required. Please log in.");
    window.location.href = "/Assets/Pages/login/index.html";
    return;
  }

  if (!confirm("Are you sure you want to delete this Ticket?")) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/ticketing/ticket/delete/${ticketId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete ticket: ${response.status}`);
    }

    alert("Ticket deleted successfully!");
    location.reload(); // Refresh the table
  } catch (error) {
    console.error("Error deleting ticket:", error);
    alert("Error deleting ticket.");
  }
}
