import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style.css";

function PotentialCustomers() {
  const [businesses, setBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const fetchBusinesses = () => {
      fetch("https://frostmarketing.no/api/customers.php")
        .then((res) => res.json())
        .then((data) => {
          setBusinesses(data);  // Sett data i tilstanden
        })
        .catch((err) => {
          console.error("Error fetching businesses:", err);
        });
    };
    
    fetchBusinesses();  // Kall funksjonen for å hente data
  }, []);  // Tom array betyr at denne effekten kun kjøres én gang ved første render
  
  const filteredBusinesses = businesses
    .filter((b) => b.is_customer !== "1")  // Only show potential customers (is_customer !== "1")
    .filter((b) => {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        b.business_name.toLowerCase().includes(lowerSearch) ||
        (b.adresse && b.adresse.toLowerCase().includes(lowerSearch))  // Use 'adresse' instead of 'address'
      );
    })
    .filter((b) => {
      if (!filterStatus) return true;
      return b.status.toLowerCase() === filterStatus.toLowerCase();
    });

  const deleteBusiness = (id) => {
    setBusinesses(businesses.filter((b) => b.id !== id));
  };

  return (
    <div className="potential-customers-container">
      <h2 className="section-title">Potential Customers</h2>

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by business name or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-dropdown"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Business</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBusinesses.map((business) => (
              <tr key={business.id}>
                <td>
                  <Link to={`/dashboard/potential/${business.id}`}>
                    {business.business_name}
                  </Link>
                </td>
                <td>{business.adresse ? business.adresse : "No address"}</td>
                <td className={`status ${business.status.toLowerCase()}`}>
                  {business.status}
                </td>
              </tr>
            ))}
            {filteredBusinesses.length === 0 && (
              <tr>
                <td colSpan="4">No matching potential customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PotentialCustomers;
