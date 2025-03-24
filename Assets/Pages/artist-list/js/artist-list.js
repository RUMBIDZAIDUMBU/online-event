document.addEventListener("DOMContentLoaded", async () => {
  // Get table body and search input elements
  const tableBody = document.querySelector("#artistTable tbody");
  const searchInput = document.querySelector("#search");

  // Check if table body exists
  if (!tableBody) {
    console.error("Error: Element with ID 'artistTable tbody' not found.");
    return;
  }

  // Retrieve token from sessionStorage
  const token = sessionStorage.getItem("authToken");

  // Redirect to login if no token is found
  if (!token) {
    console.error("No token found. User must be authenticated.");
    tableBody.innerHTML =
      "<tr><td colspan='4'>Authentication required</td></tr>";
    window.location.href = "/Assets/Pages/login/index.html";
    return;
  }

  // Function to fetch and display artists
  async function fetchAndDisplayArtists(searchTerm = "") {
    try {
      const response = await fetch(
        "http://localhost:8080/api/ticketing/artist/get-active-artist",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle non-OK responses
      if (!response.ok) {
        if (response.status === 401) {
          console.error("Token is invalid or expired.");
          sessionStorage.removeItem("authToken");
          window.location.href = "/Assets/Pages/login/index.html"; // Redirect to login
          return;
        }
        throw new Error(`Failed to fetch artist data: ${response.status}`);
      }

      // Get artist list from response
      const artistsList = await response.json();
      console.log("Fetched artists:", artistsList);

      // Filter artists based on search term
      const filteredArtists = artistsList.filter(
        (artist) =>
          artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          artist.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Clear table and populate with filtered data
      tableBody.innerHTML = "";
      filteredArtists.forEach((artist) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${artist.dateCreated || "N/A"}</td>
          <td>${artist.name}</td>
          <td>${artist.description}</td>
          <td>
            <div class="action-buttons">
              <button class="edit-button" onclick='editArtist(${JSON.stringify(
                artist
              )})'>Edit</button>
              <button class="delete-button" onclick="deleteArtist('${
                artist.id
              }')">Delete</button>
            </div>
          </td>
        `;
        tableBody.appendChild(row);
      });

      // Show message if no artists match the search
      if (filteredArtists.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='4'>No artists found</td></tr>";
      }
    } catch (error) {
      console.error("Error fetching artists:", error);
      tableBody.innerHTML = "<tr><td colspan='4'>Error loading data</td></tr>";
    }
  }

  // Initial fetch and display of artists
  fetchAndDisplayArtists();

  // Add search functionality
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.trim();
      fetchAndDisplayArtists(searchTerm);
    });
  }

  // Function to handle Edit, Store artist data and redirect
  window.editArtist = function (artistData) {
    console.log("Artist data in list:", artistData);
    sessionStorage.setItem("editArtist", JSON.stringify(artistData));
    window.location.href = "/Assets/Pages/artist-form/index.html";
  };

  // Function to handle Delete, Confirm and delete via API
  window.deleteArtist = async function (artistId) {
    if (!token) {
      alert("Authentication required. Please log in.");
      window.location.href = "/Assets/Pages/login/index.html";
      return;
    }

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
      fetchAndDisplayArtists(); // Refresh the table with current search term
    } catch (error) {
      console.error("Error deleting artist:", error);
      alert("Error deleting artist.");
    }
  };
});
