import React, { useContext, useState } from "react";
import { ApiContext } from "../contexts/ApiContext";
import { Link } from "react-router-dom";
import "../styles/App.css";

function ExistingCustomers() {
  const { businesses, deleteCustomer } = useContext(ApiContext);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter for existing customers (is_customer === "1")
  const existingCustomers = businesses.filter((business) => business.is_customer === "1");

  // Filter customers based on search term
  const filteredCustomers = existingCustomers.filter((business) =>
    business.business_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="customer-list-container">
      <h2>Existing Customers</h2>
      
      <input
        type="text"
        placeholder="Search by business name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <ul className="customer-list">
        {filteredCustomers.map((business) => (
          <li key={business.id} className="customer-item">
            <Link to={`/customer/${business.id}`}>{business.business_name}</Link>
            <button onClick={() => deleteCustomer(business.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExistingCustomers;
