document
  .getElementById("payment-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form from refreshing the page

    // Get form values
    const name = document.getElementById("name").value;
    const surname = document.getElementById("surname").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const quantity = parseInt(document.getElementById("quantity").value);
    const paymentMethod = document.getElementById("payment-method").value;

    // Paynow Channel (only set if "paynow" is selected)
    let paynowChannel = "";
    if (paymentMethod === "paynow") {
      paynowChannel = document.getElementById("paynow-channel").value;
    }

    // Calculate total amount
    const unitPrice = 10.0; // Set unit price
    const totalAmount = quantity * unitPrice;

    // Prepare payment data to be sent to backend
    const paymentData = {
      name: name,
      surname: surname,
      phone: phone,
      email: email,
      quantity: quantity,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      paynowChannel: paynowChannel,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/ticketing/payments/process",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Payment processed successfully:", result);

      // If Paynow payment is selected, initiate Paynow process here
      if (paymentMethod === "paynow") {
        // Implement Paynow API integration here, using the data returned from backend
        alert("Redirecting to Paynow for payment processing...");
        // For example, you might trigger a redirect or open a Paynow iframe
        // Paynow typically provides a payment URL for the user to complete the payment
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Payment Failed!");
    }
  });
