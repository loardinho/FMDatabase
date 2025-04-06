import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// NEW: import the AddCustomerForm so we can use it in this file
import AddCustomerForm from "./AddCustomerForm";

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

  // NEW: a helper function to re-fetch the existing customers
  // after we successfully add a new one in the form
  const reloadExisting = async () => {
    try {
      const res = await fetch("https://frostmarketing.no/api/customers.php?is_customer=1");
      const data = await res.json();
      setBusinesses(data);
    } catch (err) {
      console.error("Error re-fetching existing customers:", err);
    }
  };

  return (
    <div className="existing-customers-container">
      <h2 className="section-title">Existing Customers</h2>

      {}
      <AddCustomerForm 
        isCustomerValue={1}     
        onSuccess={reloadExisting}  
      />

      {}
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search name / address"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-dropdown"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="table">
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
    </div>
  );
}

export default ExistingCustomers;
