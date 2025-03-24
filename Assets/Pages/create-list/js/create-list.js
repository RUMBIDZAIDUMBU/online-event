// document.addEventListener("DOMContentLoaded", async () => {
//   const tableBody = document.getElementById("events-table-body");
//   if (!tableBody) {
//     console.error("Error: Element with ID 'events-table-body' not found.");
//     return;
//   }

//   // Retrieve token from sessionStorage
//   const token = sessionStorage.getItem("authToken");

//   if (!token) {
//     console.error("No token found. User must be authenticated.");
//     tableBody.innerHTML =
//       "<tr><td colspan='4'>Authentication required</td></tr>";
//     return;
//   }

//   try {
//     const response = await fetch(
//       "http://localhost:8080/api/ticketing/ticket/active-tickets",

//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       if (response.status === 401) {
//         console.error("Token is invalid or expired.");
//         //remove token if it is invlaid or expired
//         sessionStorage.removeItem("authToken");
//         window.location.href = "/login"; // Redirect to login page
//         return;
//       }
//       throw new Error("Failed to fetch events: ${response.status}");
//     }

//     const ticketList = await response.json();

//     console.log(ticketList);

//     tableBody.innerHTML = "";

//     ticketList.forEach((ticket) => {
//       const row = document.createElement("tr");

//       row.innerHTML = `
//                 <td>${ticket?.title}</td>
//                 <td>${ticket?.description}</td>
//                 <td>${ticket?.date}</td>
//                 <td>${ticket?.location}</td>
//                 <td>${ticket?.earlyBirdPrice}</td>
//                 <td>${ticket?.vipPrice}</td>
//                 <td>${ticket?.generalPrice}</td>
//         <td>
//          <button onclick='editTicket(${JSON.stringify(ticket)})'>Edit</button>
//           <button onclick="deleteTicket('${ticket.id}')">Delete</button>
//           <input type="file" id="file-${
//             ticket.id
//           }" style="display:none" accept="image/*"
//                  onchange="uploadImage(event, '${ticket.id}')">
//           <button onclick="document.getElementById('file-${
//             ticket.id
//           }').click()">Upload</button>
//         </td>

//             `;

//       tableBody.appendChild(row);
//     });
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     tableBody.innerHTML = "<tr><td colspan='4'>Error loading data</td></tr>";
//   }
// });

// // 🔼 **Upload Image Function**
// async function uploadImage(event, ticketId) {
//   // Retrieve token from sessionStorage
//   const token = sessionStorage.getItem("authToken");

//   console.log(token);

//   const file = event.target.files[0];
//   if (!file) {
//     alert("Please select an image.");
//     return;
//   }

//   const formData = new FormData();
//   formData.append("file", file);

//   try {
//     const response = await fetch(
//       "http://localhost:8080/api/ticketing/image/upload/" + ticketId,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Upload failed: ${response.status}`);
//     }

//     alert("Image uploaded successfully!");
//   } catch (error) {
//     console.error("Error uploading image:", error);
//     alert("Error uploading image.");
//   }
// }

// // Function to handle Edit, Get the artist object
// function editTicket(ticketData) {
//   console.log("ticket data in list", ticketData);
//   sessionStorage.setItem("editTicket", JSON.stringify(ticketData)); // Store artist details
//   window.location.href = "/create-form/index.html"; // Redirect to form
// }

// // Function to handle Delete
// async function deleteTicket(ticketId) {
//   const token = sessionStorage.getItem("authToken");

//   if (!confirm("Are you sure you want to delete this Ticket?")) {
//     return;
//   }

//   try {
//     const response = await fetch(
//       `http://localhost:8080/api/ticketing/ticket/delete/${ticketId}`,
//       {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Failed to delete ticket: ${response.status}`);
//     }

//     alert("Ticket deleted successfully!");
//     location.reload(); // Refresh the table
//   } catch (error) {
//     console.error("Error deleting ticket:", error);
//     alert("Error deleting ticket.");
//   }
// }

document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("events-table-body");
  if (!tableBody) {
    console.error("Error: Element with ID 'events-table-body' not found.");
    return;
  }

  try {
    // Use mock data instead of fetching from the API
    const ticketList = [
      {
        id: "1",
        title: "Event 1",
        description: "Description 1",
        date: "2024-07-15",
        location: "Location 1",
        earlyBirdPrice: 10,
        vipPrice: 20,
        generalPrice: 15,
        imageUrl: "https://via.placeholder.com/150",
      },
      {
        id: "2",
        title: "Event 2",
        description: "Description 2",
        date: "2024-07-16",
        location: "Location 2",
        earlyBirdPrice: 20,
        vipPrice: 30,
        generalPrice: 25,
        imageUrl: "https://via.placeholder.com/150",
      },
    ];

    console.log(ticketList);

    tableBody.innerHTML = "";

    ticketList.forEach((ticket) => {
      const row = document.createElement("tr");
      row.classList.add("event-row"); // Added class for styling

      row.innerHTML = `
                  <td style="color:#0891b2;">
                    <div class="event-info">
                      <div>
                        <h6 class="event-title">${ticket?.title}</h6>
                        <p class="event-date">${ticket?.date}</p>
                      </div>
                    </div>
                  </td>
                  <td style="color:#0891b2;">${ticket?.description}</td>
                  <td style="color:#0891b2;">${ticket?.location}</td>
                  <td style="color:#0891b2;">$${ticket?.earlyBirdPrice}</td>
                  <td style="color:#0891b2;">$${ticket?.vipPrice}</td>
                  <td style="color:#0891b2;">$${ticket?.generalPrice}</td>
        <td>
          <button class="edit-button" onclick='editTicket(${JSON.stringify(
            ticket
          )})'>Edit</button>
          <button class="delete-button" onclick="deleteTicket('${
            ticket.id
          }')">Delete</button>
          <input type="file" id="file-${
            ticket.id
          }" style="display:none" accept="image/*"
                  onchange="uploadImage(event, '${ticket.id}')">
          <button class="upload-button" onclick="document.getElementById('file-${
            ticket.id
          }').click()">Upload</button>
        </td>
      `;

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    tableBody.innerHTML = "<tr><td colspan='4'>Error loading data</td></tr>";
  }
});

// 🔼 **Upload Image Function**
async function uploadImage(event, ticketId) {
  // Retrieve token from sessionStorage
  const token = sessionStorage.getItem("authToken");

  console.log(token);

  const file = event.target.files[0];
  if (!file) {
    alert("Please select an image.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(
      "http://localhost:8080/api/ticketing/image/upload/" + ticketId,
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

// Function to handle Edit, Get the artist object
function editTicket(ticketData) {
  console.log("ticket data in list", ticketData);
  sessionStorage.setItem("editTicket", JSON.stringify(ticketData)); // Store artist details
  window.location.href = "/create-form/index.html"; // Redirect to form
}

// Function to handle Delete
async function deleteTicket(ticketId) {
  const token = sessionStorage.getItem("authToken");

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
