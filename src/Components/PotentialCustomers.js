// PotentialCustomers.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import "../style.css";

function PotentialCustomers() {

  const [businesses, setBusinesses] = useState([
    {
      id: 3,
      business_name: "Tech Inc",
      is_customer: 0,
      created_at: "2024-02-05",
      address: "Stavanger, Norway",
      status: "Lead",
      contacts: [
        { id: 301, first_name: "Terry", last_name: "Terrison", email: "terry@example.com" },
      ],
    },
    {
      id: 4,
      business_name: "Metro",
      is_customer: 0,
      created_at: "2024-02-15",
      address: "Trondheim, Norway",
      status: "Negotiation",
      contacts: [
        { id: 302, first_name: "Mel", last_name: "Melson", email: "mel@example.com" },
      ],
    },
    
  ]);

  // Search and filter 
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  
  const filteredBusinesses = businesses
    .filter((b) => b.is_customer === 0)
    .filter((b) => {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        b.business_name.toLowerCase().includes(lowerSearch) ||
        b.address.toLowerCase().includes(lowerSearch)
      );
    })
    .filter((b) => {
      if (!filterStatus) return true; 
      return b.status.toLowerCase() === filterStatus.toLowerCase();
    });

  // Delete a business
  const deleteBusiness = (id) => {
    setBusinesses(businesses.filter((b) => b.id !== id));
  };

  return (
    <div className="potential-customers-container">
      <h2 className="section-title potential">Potential Customers</h2>
      
      {/* Search& Filter */}
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
          <option value="Lead">Lead</option>
          <option value="Negotiation">Negotiation</option>
          <option value="Pending">Pending</option>
          <option value="Active">Active</option>
          {}
        </select>
      </div>

      {/* Tabl potential customers */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Created At</th>
              <th>Contacts</th>
              <th>Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBusinesses.map((business) => (
              <tr key={business.id}>
                <td>
                  {}
                  <Link to={`/dashboard/potential/${business.id}`}>
                    {business.business_name}
                  </Link>
                </td>
                <td>{business.created_at}</td>
                <td>
                  {business.contacts.map((contact) => (
                    <div key={contact.id}>
                      • {contact.first_name} {contact.last_name} - {contact.email}
                    </div>
                  ))}
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
                <td colSpan="6">No matching potential customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PotentialCustomers;
