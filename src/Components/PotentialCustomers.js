import React, { useContext, useState } from "react";
import { ApiContext } from "../contexts/ApiContext";
import { Link } from "react-router-dom";
import "../styles/App.css";

function PotentialCustomers() {
  const { businesses, deleteCustomer } = useContext(ApiContext);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter for potential customers (is_customer !== "1")
  const potentialCustomers = businesses.filter((business) => business.is_customer !== "1");

  // Filter customers based on search term
  const filteredCustomers = potentialCustomers.filter((business) =>
    business.business_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="customer-list-container">
      <h2>Potential Customers</h2>
      
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

export default PotentialCustomers;
