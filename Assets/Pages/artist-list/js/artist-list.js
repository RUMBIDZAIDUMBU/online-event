document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.querySelector("#artistTable tbody");

  // Retrieve token from sessionStorage
  const token = sessionStorage.getItem("authToken");

  if (!token) {
    console.error("No token found. User must be authenticated.");
    tableBody.innerHTML =
      "<tr><td colspan='4'>Authentication required</td></tr>";
    return;
  }

  try {
    const response = await fetch(
      // Get only active artist from the db
      `http://localhost:8080/api/ticketing/artist/get-active-artist`,
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
        //remove token if it is invlaid or expired
        sessionStorage.removeItem("authToken");
        window.location.href = "/login"; // Redirect to login page
        return;
      }
      throw new Error(`Failed to fetch artist data: ${response.status}`);
    }

    //get artist list from the response
    const artistsList = await response.json();

    tableBody.innerHTML = ""; // Clear table before adding data

    artistsList.forEach((artist) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${artist.dateCreated || "N/A"}</td>
        <td>${artist.name}</td>
        <td>${artist.description}</td>
        <td>
         <button onclick='editArtist(${JSON.stringify(artist)})'>Edit</button>
          <button onclick="deleteArtist('${artist.id}')">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching artists:", error);
    tableBody.innerHTML = "<tr><td colspan='4'>Error loading data</td></tr>";
  }
});

// Function to handle Edit, Get the artist object
function editArtist(artistData) {
  console.log("artist data in list", artistData);
  sessionStorage.setItem("editArtist", JSON.stringify(artistData)); // Store artist details
  window.location.href = "/artist-form/index.html"; // Redirect to form
}

// Function to handle Delete
async function deleteArtist(artistId) {
  const token = sessionStorage.getItem("authToken");

  if (!confirm("Are you sure you want to delete this artist?")) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/ticketing/artist/delete/${artistId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete artist: ${response.status}`);
    }

    alert("Artist deleted successfully!");
    location.reload(); // Refresh the table
  } catch (error) {
    console.error("Error deleting artist:", error);
    alert("Error deleting artist.");
  }
}
