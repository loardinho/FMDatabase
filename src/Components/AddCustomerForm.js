import React, { useState } from "react";
import "../style.css"; 

function AddCustomerForm({ isCustomerValue, onSuccess }) {
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("Active");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCustomer = {
      business_name: businessName,
      address: address,
      status: status,
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
        setBusinessName("");
        setAddress("");
        setStatus("Active");
      } else {
        console.error("Server returned an error:", data.message);
      }
    } catch (err) {
      console.error("Error creating customer:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-customer-form">
      <h4 className="form-title">Add New Customer</h4>

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

      <div className="form-group">
        <label className="form-label">Status:</label>
        <select
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <button type="submit" className="form-button">
        Add Customer
      </button>
    </form>
  );
}

export default AddCustomerForm;
