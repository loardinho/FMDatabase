import React, { useState } from "react";
import "../style.css"; // Assuming you have styles here

function AddCustomerForm({ isCustomerValue, onSuccess }) {
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  // --- Re-add state for the status text ---
  const [statusText, setStatusText] = useState(""); // Initialize as empty string

  // --- Determine dynamic text based on isCustomerValue ---
  const isPotentialCustomer = isCustomerValue === 0 || String(isCustomerValue) === "0";
  const formTitle = isPotentialCustomer
    ? "Add New Potential Customer"
    : "Add New Customer";
  const buttonText = isPotentialCustomer
    ? "Add Potential Customer"
    : "Add Customer";
  // --- --- --- --- --- --- --- --- --- --- --- --- --- ---

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct payload including the status text
    const newCustomer = {
      business_name: businessName,
      address: address,
      status: statusText, // Use the state variable for the status text
      is_customer: isCustomerValue,
    };

    try {
      const response = await fetch("https://frostmarketing.no/api/customers.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCustomer),
      });
      const data = await response.json();
      console.log("AddCustomerForm response:", data);

      if (data.success) {
        if (onSuccess) {
          onSuccess();
        }
        // Clear the form fields on success
        setBusinessName("");
        setAddress("");
        setStatusText(""); // Clear the status text field
      } else {
        console.error("Server returned an error:", data.message);
        alert(`Error: ${data.message || 'Failed to add.'}`);
      }
    } catch (err) {
      console.error("Error creating customer:", err);
      alert(`Error: ${err.message || 'An unexpected error occurred.'}`);
    }
  };

  // --- Render the form with the Status Text field ---
  return (
    <form onSubmit={handleSubmit} className="add-customer-form">
      <h4 className="form-title">{formTitle}</h4>

      <div className="form-group">
        <label className="form-label">Business Name:</label>
        <input
          type="text"
          className="form-input"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Address:</label>
        <input
          type="text"
          className="form-input"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      {/* --- Add input field for Status Text --- */}
      <div className="form-group">
        <label className="form-label">Status Note:</label>
        {/* You could use a textarea if the status notes might be long */}
        <input
          type="text"
          className="form-input"
          value={statusText}
          onChange={(e) => setStatusText(e.target.value)}
          // Add 'required' if a status note must always be provided, otherwise leave it optional
        />
        {/* Example using textarea instead:
        <textarea
            className="form-input" // Adjust styling if needed
            value={statusText}
            onChange={(e) => setStatusText(e.target.value)}
            rows="3" // Example height
        ></textarea>
        */}
      </div>
      {/* --- --- --- --- --- --- --- --- --- --- */}

      <button type="submit" className="form-button">
        {buttonText}
      </button>
    </form>
  );
}

export default AddCustomerForm;