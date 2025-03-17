import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ApiContext } from "../ApiContext";

function CustomerDetails() {
  const { id } = useParams(); // Get the ID from URL params
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchCustomer, deleteCustomer, contacts } = useContext(ApiContext);

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch customer data when the component mounts or when `id` changes
  useEffect(() => {
    const getCustomerData = async () => {
      console.log(`Fetching customer data for ID: ${id}`);  // Debugging log
      const data = await fetchCustomer(id);  // Fetch customer by ID
      console.log("Fetched customer data:", data); // Log the fetched customer data

      if (data) {
        setCustomer(data);  // If data is fetched, set it
      } else {
        setCustomer(null);  // If no data, handle as not found
      }

      setLoading(false); // Set loading to false once data is fetched
    };

    getCustomerData(); // Fetch the customer data
  }, [id, fetchCustomer]); // Re-run effect when `id` changes

  // Handle customer deletion
  const handleDeleteCustomer = async () => {
    const success = await deleteCustomer(id);
    if (success) {
      // After deletion, navigate to the relevant page
      navigate(location.pathname.includes("existing") ? "/dashboard/existing" : "/dashboard/potential");
    }
  };

  // Show loading state while fetching data
  if (loading) return <div>Loading...</div>;

  // Show message if no customer found
  if (!customer) return <div>Customer not found</div>;

  // Check if there are contacts for the specific customer
  const customerContacts = contacts[customer.id] || [];

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Details for {customer.business_name}</h2>
      <p><strong>Address:</strong> {customer.address}</p>
      <p><strong>Status:</strong> {customer.status}</p>
      <p><strong>Info:</strong> {customer.info}</p>

      <h3>Contacts</h3>
      <ul>
        {customerContacts.length > 0 ? (
          customerContacts.map((contact) => (
            <li key={contact.id}>
              <strong>{contact.name}</strong> - {contact.email}
            </li>
          ))
        ) : (
          <p>No contacts found for this customer.</p>
        )}
      </ul>

      <button onClick={handleDeleteCustomer}>Delete This Customer</button>
    </div>
  );
}

export default CustomerDetails;
