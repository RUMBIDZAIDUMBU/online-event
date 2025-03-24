document.addEventListener("DOMContentLoaded", () => {
  // Handle Delete Button Click for .btn-danger
  document.querySelectorAll(".btn-danger").forEach((button) => {
    button.addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      if (row && confirm("Are you sure you want to delete this item?")) {
        row.remove(); // Removes the table row
      }
    });
  });

  // Handle Edit Button Click for .btn-info
  document.querySelectorAll(".btn-info").forEach((button) => {
    button.addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      if (!row) return; // Exit if no row found

      const columns = row.querySelectorAll("td");
      const tableId = row.parentElement.parentElement.id;

      // Edit logic for manage-events table
      if (tableId === "manage-events" && columns.length >= 3) {
        const eventName = columns[1].textContent;
        const eventDate = columns[2].textContent;

        const newName = prompt("Edit Event Name:", eventName);
        const newDate = prompt("Edit Event Date (YYYY-MM-DD):", eventDate);

        if (newName && newDate) {
          columns[1].textContent = newName;
          columns[2].textContent = newDate;
        }
      }

      // Edit logic for manage-users table
      if (tableId === "manage-users" && columns.length >= 3) {
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
