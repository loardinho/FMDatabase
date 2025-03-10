import React, { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import "../style.css";

function ExistingCustomers() {
  // Demo - can fetch from an API or parent context later
  const [businesses, setBusinesses] = useState([
  ]);

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    //API added
    fetch("https://frostmarketing.no/api/customers.php")
      .then((res) => res.json())
      .then((data) => {
        setBusinesses(data);
        
      })
      .catch((err) => {
        console.error("Error fetching existing customers:", err);
      });
  }, []);

  // Filter logic
 
  const filteredBusinesses = businesses
    // Only show "existing" customers (is_customer === 1)
    .filter((b) => b.is_customer === 1)

    // Search  business name / address
    .filter((b) => {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        b.business_name.toLowerCase().includes(lowerSearch) ||
        b.address.toLowerCase().includes(lowerSearch)
      );
    })
    // Status by filter if chosen 
    .filter((b) => {
      if (!filterStatus) return true; // if filterStatus is empty, show all
      return b.status.toLowerCase() === filterStatus.toLowerCase();
    });

  
  // Delete bznz
  
  const deleteBusiness = (id) => {
    setBusinesses(businesses.filter((b) => b.id !== id));
  };

  
  // search input, filter dropdown, table etc

  return (
    <div className="existing-customers-container">
      <h2 className="section-title">Existing Customers</h2>

      {}
      {}
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
    {}
  </select>
</div>


      {}
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
                {/* Clickable lenke til /dashboard/existing/:id */}
                <td>
                  <Link to={`/dashboard/existing/${business.id}`}>
                    {business.business_name}
                  </Link>
                </td>
                <td>{business.address}</td>
                <td className={`status ${business.status.toLowerCase()}`}>
                  {business.status}
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteBusiness(business.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}

            {}
            {filteredBusinesses.length === 0 && (
              <tr>
                <td colSpan="5">No matching customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExistingCustomers;
