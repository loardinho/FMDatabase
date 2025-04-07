import React, { useState, useEffect, useContext } // Import useContext
  from "react";
import { Link } from "react-router-dom";
import AddCustomerForm from "./AddCustomerForm";
import { ApiContext } from "../ApiContext"; // Import ApiContext

function ExistingCustomers() {
  const [businesses, setBusinesses] = useState([]); // Initial state is correctly an array
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(''); // Add error state

  // Use the fetch function from context for consistency
  const { fetchCustomersList } = useContext(ApiContext);

  // Function to load/reload data using context function
  const loadExisting = async () => {
    setLoading(true);
    setError(''); // Clear previous errors
    try {
      const data = await fetchCustomersList(1); // Use context function, '1' for existing
      // The context function already handles errors and returns [] on failure
      // It also already includes credentials: 'include'
      if (Array.isArray(data)) {
          console.log("Loaded existing customers:", data);
          setBusinesses(data);
      } else {
          // This case should ideally not happen if context function is correct
          console.error("Received non-array data from fetchCustomersList:", data);
          setError("Failed to load customer data correctly.");
          setBusinesses([]);
      }
    } catch (err) {
       // Catch errors from the async call itself (e.g., network error)
      console.error("Error calling fetchCustomersList:", err);
      setError("An error occurred while fetching customers.");
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadExisting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCustomersList]); // Depend on the context function instance


  // Filtering - Add check to ensure businesses is an array before filtering
  const filtered = Array.isArray(businesses) ? businesses.filter((b) => {
      const lower = searchTerm.toLowerCase();
      // Ensure properties exist before calling toLowerCase
      const nameMatch = b.business_name && b.business_name.toLowerCase().includes(lower);
      const addressMatch = b.adresse && b.adresse.toLowerCase().includes(lower); // Use 'adresse' to match PHP
      return nameMatch || addressMatch;
    }) : []; // Default to empty array if businesses is not an array


  return (
    <div className="existing-customers-container">
      <h2 className="section-title">Existing Customers</h2>

      {/* Add Customer Form */}
      <AddCustomerForm
        isCustomerValue={1}
        onSuccess={loadExisting} // Call loadExisting to refresh list on success
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
        <p>Loading customers...</p>
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
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((b) => (
                  <tr key={b.id}>
                    <td>
                      {/* Link uses 'id', ensure your routes are set up for /dashboard/existing/:id */}
                      <Link to={`/dashboard/existing/${b.id}`}>{b.business_name}</Link>
                    </td>
                    {/* Display 'adresse' from PHP, or fallback */}
                    <td>{b.adresse || "No address"}</td>
                    <td>{b.status || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">
                    {searchTerm ? "No matching customers found." : "No existing customers found."}
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

export default ExistingCustomers;