import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ExistingCustomers() {
  const [businesses, setBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    async function loadExisting() {
      try {
        const res = await fetch("https://frostmarketing.no/api/customers.php?is_customer=1");
        const data = await res.json();
        console.log("Loaded existing customers:", data);
        setBusinesses(data);
      } catch (err) {
        console.error("Error fetching existing customers:", err);
      }
    }
    loadExisting();
  }, []);

  const filtered = businesses
    .filter((b) => {
      const lower = searchTerm.toLowerCase();
      return (
        b.business_name.toLowerCase().includes(lower) ||
        b.address?.toLowerCase().includes(lower)
      );
    })
    .filter((b) => {
      if (!filterStatus) return true;
      return b.status?.toLowerCase() === filterStatus.toLowerCase();
    });

  return (
    <div>
      <h2>Existing Customers</h2>
      <div>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search name / address"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Business</th>
            <th>Address</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((b) => (
            <tr key={b.id}>
              <td>
                <Link to={`/dashboard/existing/${b.id}`}>{b.business_name}</Link>
              </td>
              <td>{b.address || "No address"}</td>
              <td>{b.status}</td>
            </tr>
          ))}

          {filtered.length === 0 && (
            <tr>
              <td colSpan="3">No matching customers found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ExistingCustomers;
