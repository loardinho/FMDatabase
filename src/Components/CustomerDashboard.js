import React, { useState } from "react";
import "../style.css";
import { FaTrash } from "react-icons/fa";

const CustomerDashboard = () => {
  // Simulated data (to be replaced with API calls later)
  const [businesses, setBusinesses] = useState([
    {
      id: 1,
      business_name: "Al Inc",
      er_kunde: true,
      created_at: "2024-02-01",
      address: "Oslo, Norway",
      status: "Active",
      contacts: [
        { id: 1, first_name: "Ben", last_name: "Benson", email: "ben@example.com" },
      ],
    },
    {
      id: 2,
      business_name: "Tech",
      er_kunde: true,
      created_at: "2024-03-01",
      address: "Bergen, Norway",
      status: "Pending",
      contacts: [
        { id: 2, first_name: "Tod", last_name: "Todson", email: "tod@example.com" },
      ],
    },
    {
      id: 3,
      business_name: "Tech Inc",
      er_kunde: false,
      created_at: "2024-02-05",
      address: "Stavanger, Norway",
      status: "Lead",
      contacts: [
        { id: 3, first_name: "Terry", last_name: "Terrison", email: "terry@example.com" },
      ],
    },
    {
      id: 4,
      business_name: "Metro",
      er_kunde: false,
      created_at: "2024-02-15",
      address: "Trondheim, Norway",
      status: "Negotiation",
      contacts: [
        { id: 4, first_name: "Mel", last_name: "Melson", email: "mel@example.com" },
      ],
    },
  ]);

  const deleteBusiness = (id) => {
    setBusinesses(businesses.filter((business) => business.id !== id));
  };

  return (
    <div className="dashboard-container">
      <h2 className="section-title">Existing Customers</h2>
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
            {businesses.filter(b => b.er_kunde).map((business) => (
              <tr key={business.id}>
                <td>{business.business_name}</td>
                <td>{business.created_at}</td>
                <td>
                  {business.contacts.map((contact) => (
                    <div key={contact.id}>
                      • {contact.first_name} {contact.last_name} - {contact.email}
                    </div>
                  ))}
                </td>
                <td>{business.address}</td>
                <td className={`status ${business.status.toLowerCase()}`}>{business.status}</td>
                <td>
                  <button className="delete-btn" onClick={() => deleteBusiness(business.id)}>
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <h2 className="section-title potential">Potential Customers</h2>
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
            {businesses.filter(b => !b.er_kunde).map((business) => (
              <tr key={business.id}>
                <td>{business.business_name}</td>
                <td>{business.created_at}</td>
                <td>
                  {business.contacts.map((contact) => (
                    <div key={contact.id}>
                      • {contact.first_name} {contact.last_name} - {contact.email}
                    </div>
                  ))}
                </td>
                <td>{business.address}</td>
                <td className={`status ${business.status.toLowerCase()}`}>{business.status}</td>
                <td>
                  <button className="delete-btn" onClick={() => deleteBusiness(business.id)}>
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerDashboard;