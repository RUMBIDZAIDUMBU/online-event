// document.addEventListener("DOMContentLoaded", async () => {
//   const tableBody = document.querySelector("#artistTable tbody");

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
//       // Get only active artist from the db
//       `http://localhost:8080/api/ticketing/artist/get-active-artist`,
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
//       throw new Error(`Failed to fetch artist data: ${response.status}`);
//     }

//     //get artist list from the response
//     const artistsList = await response.json();

//     tableBody.innerHTML = ""; // Clear table before adding data

//     artistsList.forEach((artist) => {
//       const row = document.createElement("tr");
//       row.innerHTML = `
//         <td>${artist.dateCreated || "N/A"}</td>
//         <td>${artist.name}</td>
//         <td>${artist.description}</td>
//         <td>
//          <button onclick='editArtist(${JSON.stringify(artist)})'>Edit</button>
//           <button onclick="deleteArtist('${artist.id}')">Delete</button>
//         </td>
//       `;
//       tableBody.appendChild(row);
//     });
//   } catch (error) {
//     console.error("Error fetching artists:", error);
//     tableBody.innerHTML = "<tr><td colspan='4'>Error loading data</td></tr>";
//   }
// });

// // Function to handle Edit, Get the artist object
// function editArtist(artistData) {
//   console.log("artist data in list", artistData);
//   sessionStorage.setItem("editArtist", JSON.stringify(artistData)); // Store artist details
//   window.location.href = "/artist-form/index.html"; // Redirect to form
// }

// // Function to handle Delete
// async function deleteArtist(artistId) {
//   const token = sessionStorage.getItem("authToken");

//   if (!confirm("Are you sure you want to delete this artist?")) {
//     return;
//   }

//   try {
//     const response = await fetch(
//       `http://localhost:8080/api/ticketing/artist/delete/${artistId}`,
//       {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Failed to delete artist: ${response.status}`);
//     }

//     alert("Artist deleted successfully!");
//     location.reload(); // Refresh the table
//   } catch (error) {
//     console.error("Error deleting artist:", error);
//     alert("Error deleting artist.");
//   }
// }
document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.querySelector("#artistTable tbody");
  const searchInput = document.querySelector("#search");

  // Sample data (replace with your actual data source)
  const sampleArtistData = [
    {
      id: "1",
      name: "Alick Macheso",
      description: "King of Sungura music.",
      dateCreated: "2023-01-15",
    },
    {
      id: "2",
      name: "Janet Jackson",
      description: "Pop icon and actress.",
      dateCreated: "2023-02-20",
    },
    {
      id: "3",
      name: "Oliver Mtukudzi",
      description: "Legendary Zimbabwean musician.",
      dateCreated: "2023-03-10",
    },
    {
      id: "4",
      name: "Thomas Mapfumo",
      description: "Chimurenga music pioneer.",
      dateCreated: "2023-04-05",
    },
    {
      id: "5",
      name: "Brenda Fassie",
      description: "South African pop diva.",
      dateCreated: "2023-05-12",
    },
    {
      id: "6",
      name: "Winky D",
      description: "Zimdancehall artist",
      dateCreated: "2023-06-18",
    },
    {
      id: "7",
      name: "Bebe Winans",
      description: "Gospel artist",
      dateCreated: "2023-07-22",
    },
  ];

  function displayArtists(artists) {
    tableBody.innerHTML = ""; // Clear table before adding data
    artists.forEach((artist) => {
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
  }

  // Initial display of all artists
  displayArtists(sampleArtistData);

  // Function to handle Edit, Get the artist object
  window.editArtist = function (artistData) {
    console.log("artist data in list", artistData);
    sessionStorage.setItem("editArtist", JSON.stringify(artistData)); // Store artist details
    window.location.href = "/artist-form/index.html"; // Redirect to form
  };

  // Function to handle Delete
  window.deleteArtist = async function (artistId) {
    if (!confirm("Are you sure you want to delete this artist?")) {
      return;
    }

    try {
      // Simulate API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          // Remove the artist from the sample data
          const index = sampleArtistData.findIndex((a) => a.id === artistId);
          if (index !== -1) {
            sampleArtistData.splice(index, 1);
            resolve({ ok: true, status: 200 }); // Simulate success
          } else {
            resolve({ ok: false, status: 404 }); // Simulate not found
          }
        }, 500); // Simulate network latency
      });

      if (!response.ok) {
        throw new Error(`Failed to delete artist: ${response.status}`);
      }

      alert("Artist deleted successfully!");
      displayArtists(sampleArtistData); // Refresh the table
    } catch (error) {
      console.error("Error deleting artist:", error);
      alert("Error deleting artist.");
    }
  };

  // Event listener for the search input
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredArtists = sampleArtistData.filter(
      (artist) =>
        artist.name.toLowerCase().includes(searchTerm) ||
        artist.description.toLowerCase().includes(searchTerm)
    );
    displayArtists(filteredArtists);
  });
});
