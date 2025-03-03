import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import "../style.css";

const PotentialCustomers = () => {
  const [businesses, setBusinesses] = useState([
    {
      id: 3,
      business_name: "Tech Inc",
      is_customer: 0,
      created_at: "2024-02-05",
      address: "Stavanger, Norway",
      status: "Lead",
      contacts: [
        {
          id: 3,
          first_name: "Terry",
          last_name: "Terrison",
          email: "terry@example.com",
        },
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
        { id: 4, first_name: "Mel", last_name: "Melson", email: "mel@example.com" },
      ],
    },
    
  ]);

  const deleteBusiness = (id) => {
    setBusinesses(businesses.filter((business) => business.id !== id));
  };

  return (
    <div>
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
            {businesses
              .filter((b) => b.is_customer === 0)
              .map((business) => (
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PotentialCustomers;
