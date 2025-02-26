import React, { useState, useEffect } from "react";
import "../style.css";


const CustomerDashboard = () => {
  // Simulert data (erstattes med API-kall senere)
  const [businesses, setBusinesses] = useState([
    {
      id: 1,
      business_name: "Bedrift A",
      er_kunde: true,
      created_at: "2024-02-01",
      contacts: [
        { id: 1, first_name: "Blala1", last_name: "Lastname", email: "blala@example.com", phone: "12345678" },
      ],
    },
    {
      id: 2,
      business_name: "Bedrift B",
      er_kunde: false,
      created_at: "2024-02-05",
      contacts: [
        { id: 2, first_name: "Lalala", last_name: "Lastnamee", email: "lala@example.com", phone: "87654321" },
      ],
    },
    {
      id: 3,
      business_name: "Bedrift C",
      er_kunde: true,
      created_at: "2024-01-20",
      contacts: [
        { id: 3, first_name: "Hihi", last_name: "Hi", email: "hihih@example.com", phone: "11112222" },
      ],
    },
  ]);

  return (
    <div className="dashboard-container">
      <h1>Customer Database</h1>

      {/* Eksisterende kunder */}
      <h2>Eksisterende Kunder</h2>
      <table>
        <thead>
          <tr>
            <th>Bedrift</th>
            <th>Kontaktperson</th>
            <th>Email</th>
            <th>Telefon</th>
            <th>Opprettet</th>
          </tr>
        </thead>
        <tbody>
          {businesses
            .filter((b) => b.er_kunde) // Filtrer kun eksisterende kunder
            .map((business) => (
              <tr key={business.id}>
                <td>{business.business_name}</td>
                <td>
                  {business.contacts.length > 0
                    ? `${business.contacts[0].first_name} ${business.contacts[0].last_name}`
                    : "Ingen kontakt"}
                </td>
                <td>{business.contacts.length > 0 ? business.contacts[0].email : "N/A"}</td>
                <td>{business.contacts.length > 0 ? business.contacts[0].phone : "N/A"}</td>
                <td>{business.created_at}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Potensielle kunder */}
      <h2>Potensielle Kunder</h2>
      <table>
        <thead>
          <tr>
            <th>Bedrift</th>
            <th>Kontaktperson</th>
            <th>Email</th>
            <th>Telefon</th>
            <th>Opprettet</th>
          </tr>
        </thead>
        <tbody>
          {businesses
            .filter((b) => !b.er_kunde) // Filtrer kun potensielle kunder
            .map((business) => (
              <tr key={business.id}>
                <td>{business.business_name}</td>
                <td>
                  {business.contacts.length > 0
                    ? `${business.contacts[0].first_name} ${business.contacts[0].last_name}`
                    : "Ingen kontakt"}
                </td>
                <td>{business.contacts.length > 0 ? business.contacts[0].email : "N/A"}</td>
                <td>{business.contacts.length > 0 ? business.contacts[0].phone : "N/A"}</td>
                <td>{business.created_at}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerDashboard;
