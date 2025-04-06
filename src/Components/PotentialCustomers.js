import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style.css";
import AddCustomerForm from "./AddCustomerForm";



function PotentialCustomers() {
  const [businesses, setBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadPotential() {
      try {
        const res = await fetch("https://frostmarketing.no/api/customers.php?is_customer=0");
        const data = await res.json();
        console.log("Loaded potential customers:", data);
        setBusinesses(data);
      } catch (err) {
        console.error("Error fetching potential customers:", err);
      }
    }
    loadPotential();
  }, []);

  const filtered = businesses
    .filter((b) => {
      const lower = searchTerm.toLowerCase();
      return (
        b.business_name.toLowerCase().includes(lower) ||
        b.address?.toLowerCase().includes(lower)
      );
    })


  // NEW: a helper function to re-fetch the existing customers
  // after we successfully add a new one in the form
  const reloadPotential = async () => {
    try {
      const res = await fetch("https://frostmarketing.no/api/customers.php?is_customer=0");
      const data = await res.json();
      setBusinesses(data);
    } catch (err) {
      console.error("Error re-fetching potential customers:", err);
    }
  };



  return (
    <div className="potential-customers-container">
      <h2 className="section-title">Potential Customers</h2>

      {}
      <AddCustomerForm 
        isCustomerValue={0}     
        onSuccess={reloadPotential}  
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
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Business</th>
              <th>Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id}>
                <td>
                  <Link to={`/dashboard/potential/${b.id}`}>
                    {b.business_name}
                  </Link>
                </td>
                <td>{b.address || b.adresse || "No address"}</td>
                <td>{b.status}</td>
                <td>{/* optional actions */}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
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
