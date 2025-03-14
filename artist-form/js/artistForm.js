document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("artist-form");
  const nameInput = document.getElementById("artistName");
  const descriptionInput = document.getElementById("artistDescription");
  const successMessage = document.getElementById("success-message");
  const errorMessage = document.getElementById("error-message");

  let artistId = null; // To store the ID of the artist being edited

  // Check if editing an artist
  const artistData = sessionStorage.getItem("editArtist");
  let artist = null;

  if (artistData) {
    artist = JSON.parse(artistData);

    artistId = artist.id; // Store artist ID

    nameInput.value = artist.name;
    descriptionInput.value = artist.description;
    // sessionStorage.removeItem("editArtist"); // Clear after loading
  }

  // Handle form submission
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = sessionStorage.getItem("authToken");

    if (!token) {
      alert("You must be logged in.");
      return;
    }

    // const artistDetails = {
    //   name: nameInput.value.trim(),
    //   description: descriptionInput.value.trim(),
    // };

    console.log(artistId);
    if (artistId !== null) {
      artist.name = nameInput.value.trim();
      artist.description = descriptionInput.value.trim();
    }

    const artistDetails = artistId
      ? artist
      : {
          name: nameInput.value.trim(),
          description: descriptionInput.value.trim(),
        };

    // const url = artistId
    //   ? `http://localhost:8080/api/ticketing/artist/update/${artistId}` // PUT request for update
    //  : "http://localhost:8080/api/ticketing/artist/create"; // POST request for new artist

    // const method = artistId ? "PUT" : "POST"; // Determine HTTP method

    const url = "http://localhost:8080/api/ticketing/artist/create";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(artistDetails),
      });

      if (!response.ok) {
        throw new Error("Failed to save artist.");
      }

      successMessage.style.display = "block";
      errorMessage.style.display = "none";
      sessionStorage.removeItem("editArtist"); // Clear after loading
      setTimeout(() => {
        window.location.href = "/artist-list/index.html"; // Redirect to artist list
      }, 1500);
    } catch (error) {
      console.error("Error saving artist:", error);
      successMessage.style.display = "none";
      errorMessage.style.display = "block";
    }
  });
});
