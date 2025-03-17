import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiContext } from "../contexts/ApiContext";
import "../styles/App.css";

function CustomerDetails() {
  const { id } = useParams(); // Get customer ID from the URL
  const { businesses, contacts } = useContext(ApiContext);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    // Find the selected customer based on ID
    const selectedCustomer = businesses.find((business) => business.id === id);
    setCustomer(selectedCustomer);
  }, [id, businesses]);

  if (!customer) return <div>Customer not found</div>;

  return (
    <div className="customer-details">
      <h2>{customer.business_name}</h2>
      <p><strong>Address:</strong> {customer.adresse || "No address provided"}</p>
      <p><strong>Status:</strong> {customer.status}</p>
      <p><strong>Info:</strong> {customer.info || "No additional info"}</p>

      <h3>Contacts</h3>
      {contacts.filter(contact => contact.business_id === customer.id).length === 0 ? (
        <p>No contacts found for this customer.</p>
      ) : (
        <ul>
          {contacts
            .filter((contact) => contact.business_id === customer.id)
            .map((contact) => (
              <li key={contact.id}>
                {contact.name} - {contact.email}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default CustomerDetails;
