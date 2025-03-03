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
      address: "Trondheim, Norway",
      status: "Negotiation",
      contacts: [
        { id: 302, first_name: "Mel", last_name: "Melson", email: "mel@example.com" },
      ],
    },
  ]);

  // For search filter logic
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Filter logic 
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

  const deleteBusiness = (id) => {
    setBusinesses(businesses.filter((b) => b.id !== id));
  };

  return (
    <div className="potential-customers-container">
      <h2 className="section-title potential">Potential Customers</h2>
      
      {}
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by business name or addr"
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
        </select>
      </div>

      {}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {/* Match your existing table columns exactly */}
              <th>Business</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBusinesses.map((business) => (
              <tr key={business.id}>
                {}
                <td>
                  <Link to={`/dashboard/potential/${business.id}`}>
                    {business.business_name}
                  </Link>
                </td>

                {}
                <td>
                  {business.contacts.map((contact) => (
                    <div key={contact.id}>
                      {contact.first_name} {contact.last_name} - {contact.email}
                    </div>
                  ))}
                </td>

                <td className={`status ${business.status.toLowerCase()}`}>
                  {business.status}
                </td>

                <td>{business.address}</td>

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

            {filteredBusinesses.length === 0 && (
              <tr>
                <td colSpan="5">No matching potential customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PotentialCustomers;
