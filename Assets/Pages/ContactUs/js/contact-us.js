document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.querySelector(".contact-form");

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Collect form data
    const name = document.querySelector("input[placeholder='name']").value;
    const email = document.querySelector("input[placeholder='email']").value;
    const message = document.querySelector(
      "textarea[placeholder='message']"
    ).value;

    if (!name || !email || !message) {
      alert("Please fill out all fields.");
      return;
    }

    // Create payload
    const contactData = {
      name,
      email,
      message,
    };
    console.log(contactData);
    try {
      const response = await fetch(
        "http://localhost:8080/api/ticketing/contact-us/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactData),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        alert(responseData.message || "Contact saved successfully.");
        contactForm.reset();
      } else {
        const errorData = await response.json();
        alert(
          errorData.message || "An error occurred while submitting the form."
        );
      }
    } catch (error) {
      console.error("Error while submitting the form:", error);
      alert("An error occurred. Please try again later.");
    }
  });
});
