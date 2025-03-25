import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ApiContext } from "../ApiContext";

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

 
  const { fetchCustomer, fetchContacts, deleteCustomer } = useContext(ApiContext);

  const [customer, setCustomer] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  //fetch customr
  useEffect(() => {
    async function loadCustomer() {
      const data = await fetchCustomer(id);
      setCustomer(data);
    }
    loadCustomer();
  }, [id, fetchCustomer]);

  //fetch contacts
  useEffect(() => {
    async function loadContacts() {
      const data = await fetchContacts(id);
      setContacts(data);
    }
    loadContacts();
  }, [id, fetchContacts]);

  //Are they loaded check
  useEffect(() => {
    if (customer !== null && contacts !== null) {
      setLoading(false);
    }
  }, [customer, contacts]);

  // Delete customer
  const handleDelete = async () => {
    const success = await deleteCustomer(id);
    if (success) {
      navigate(
        location.pathname.includes("existing")
          ? "/dashboard/existing"
          : "/dashboard/potential"
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!customer) return <div>Customer not found</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Details for {customer.business_name}</h2>
      <p><strong>Business Type:</strong> {customer.business_type}</p>
      <p><strong>Address:</strong> {customer.address}</p>
      <p><strong>Status:</strong> {customer.status}</p>
      <p><strong>Info:</strong> {customer.information}</p>

      <h3>Contacts</h3>
      {contacts.length > 0 ? (
        <ul>
          {contacts.map((c) => (
            <li key={c.id}>
              {c.first_name} {c.last_name} ({c.email}, {c.phone})
            </li>
          ))}
        </ul>
      ) : (
        <p>No contacts found.</p>
      )}

      <button onClick={handleDelete}>Delete This Customer</button>
    </div>
  );
}

export default CustomerDetails;
