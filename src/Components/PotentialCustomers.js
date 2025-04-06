import React, { useState, useEffect, useContext } // Import useContext
  from "react";
import { Link } from "react-router-dom";
import "../style.css"; // Assuming path is correct
import AddCustomerForm from "./AddCustomerForm";
import { ApiContext } from "../ApiContext"; // Import ApiContext (Adjust path if needed)

function PotentialCustomers() {
  const [businesses, setBusinesses] = useState([]); // Initial state is correctly an array
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(''); // Add error state

  // Use the fetch function from context
  const { fetchCustomersList } = useContext(ApiContext);

  // Function to load/reload data using context function
  const loadPotential = async () => {
    setLoading(true);
    setError(''); // Clear previous errors
    try {
      // Call context function with '0' for potential customers
      const data = await fetchCustomersList(0);
      // The context function should handle credentials and basic errors, returning [] on failure
      if (Array.isArray(data)) {
          console.log("Loaded potential customers:", data);
          setBusinesses(data);
      } else {
          console.error("Received non-array data from fetchCustomersList(0):", data);
          setError("Failed to load potential customer data correctly.");
          setBusinesses([]);
      }
    } catch (err) {
      // Catch errors from the async call itself
      console.error("Error calling fetchCustomersList(0):", err);
      setError("An error occurred while fetching potential customers.");
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadPotential();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCustomersList]); // Depend on the context function instance


  // Filtering - Add check to ensure businesses is an array before filtering
  const filtered = Array.isArray(businesses) ? businesses.filter((b) => {
      const lower = searchTerm.toLowerCase();
      // Ensure properties exist before calling toLowerCase
      // Using 'adresse' as that's likely what PHP script uses based on previous files
      const nameMatch = b.business_name && b.business_name.toLowerCase().includes(lower);
      const addressMatch = b.adresse && b.adresse.toLowerCase().includes(lower);
      return nameMatch || addressMatch;
    }) : []; // Default to empty array if businesses is not an array


  return (
    <div className="potential-customers-container">
      <h2 className="section-title">Potential Customers</h2>

      {/* Add Customer Form */}
      <AddCustomerForm
        isCustomerValue={0} // Set for potential customer
        onSuccess={loadPotential} // Call loadPotential to refresh list
      />

      {/* Search Input */}
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search name / address"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading} // Disable search while loading
        />
      </div>

      {/* Loading / Error / Table Display */}
      {loading ? (
        <p>Loading potential customers...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
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
              {filtered.length > 0 ? (
                filtered.map((b) => (
                  <tr key={b.id}>
                    <td>
                      {/* Link uses 'id', ensure routes are for /dashboard/potential/:id */}
                      <Link to={`/dashboard/potential/${b.id}`}>
                        {b.business_name}
                      </Link>
                    </td>
                     {/* Display 'adresse' from PHP, or fallback */}
                    <td>{b.adresse || "No address"}</td>
                    <td>{b.status || "N/A"}</td>
                    <td>{/* optional actions */}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">
                     {searchTerm ? "No matching potential customers found." : "No potential customers found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PotentialCustomers;