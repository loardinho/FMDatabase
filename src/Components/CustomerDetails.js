import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ApiContext } from "../ApiContext";

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchCustomer, deleteCustomer } = useContext(ApiContext);

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCustomerData = async () => {
      try {
        console.log("Fetching customer data for ID:", id);
        const data = await fetchCustomer(id); // Fetch customer data
        console.log("Fetched customer data:", data);

        if (Array.isArray(data)) {
          const foundCustomer = data.find(c => String(c.id) === String(id)); // Ensure ID is a string match
          setCustomer(foundCustomer || null);
        } else if (typeof data === "object" && data !== null) {
          setCustomer(data);
        } else {
          setCustomer(null);
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
        setCustomer(null);
      } finally {
        setLoading(false);
      }
    };

    getCustomerData();
  }, [id, fetchCustomer]);

  const handleDeleteCustomer = async () => {
    const success = await deleteCustomer(id);
    if (success) {
      navigate(location.pathname.includes("existing") ? "/dashboard/existing" : "/dashboard/potential");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!customer) return <div>Customer not found</div>;

  console.log("Rendering customer:", customer);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Details for {customer.business_name}</h2>
      <p><strong>Business type:</strong> {customer.business_type}</p>
      <p><strong>Address:</strong> {customer.address}</p>
      <p><strong>Status:</strong> {customer.status}</p>
      <p><strong>Info:</strong> {customer.information}</p>

      <button onClick={handleDeleteCustomer}>Delete This Customer</button>
    </div>
  );
}

export default CustomerDetails;
