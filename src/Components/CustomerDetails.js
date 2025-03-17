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

  // Fetch customer data when component mounts
  useEffect(() => {
    const getCustomerData = async () => {
      try {
        console.log("Fetching customer data for ID:", id);  // Debugging log
        const data = await fetchCustomer(id);
        console.log("Fetched customer data:", data);  // Log the fetched data
        if (Array.isArray(data)) {
          setCustomer(data[0]);  // If it's an array, take the first customer
        } else {
          setCustomer(data);  // Otherwise, just set the data directly
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
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

  console.log("Rendering customer:", customer);  // Debugging log to check the customer data

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
