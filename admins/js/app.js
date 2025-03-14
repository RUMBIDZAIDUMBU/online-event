document.addEventListener("DOMContentLoaded", function () {
  // Handle Delete Button Click
  document.querySelectorAll(".btn-danger").forEach((button) => {
    button.addEventListener("click", function () {
      if (confirm("Are you sure you want to delete this item?")) {
        this.closest("tr").remove(); // Removes the row
      }
    });
  });

  // Handle Edit Button Click
  document.querySelectorAll(".btn-info").forEach((button) => {
    button.addEventListener("click", function () {
      const row = this.closest("tr");
      const columns = row.querySelectorAll("td");

      // Example for managing events
      if (row.parentElement.parentElement.id === "manage-events") {
        const eventName = columns[1].textContent;
        const eventDate = columns[2].textContent;
        const newName = prompt("Edit Event Name:", eventName);
        const newDate = prompt("Edit Event Date (YYYY-MM-DD):", eventDate);

        if (newName && newDate) {
          columns[1].textContent = newName;
          columns[2].textContent = newDate;
        }
      }

      // Example for managing users
      if (row.parentElement.parentElement.id === "manage-users") {
        const userName = columns[1].textContent;
        const userEmail = columns[2].textContent;
        const newUserName = prompt("Edit User Name:", userName);
        const newUserEmail = prompt("Edit User Email:", userEmail);

        if (newUserName && newUserEmail) {
          columns[1].textContent = newUserName;
          columns[2].textContent = newUserEmail;
        }
      }
    });
  });
});
