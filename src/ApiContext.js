import React, { createContext } from "react";

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {

  // --- Customer Functions ---
  const fetchCustomersList = async (isCustomerVal = 1) => {
    try {
      const response = await fetch(
        `https://frostmarketing.no/api/customers.php?is_customer=${isCustomerVal}`,
        // *** Add options object with credentials for consistency ***
        {
           method: 'GET', // Explicit method
           credentials: 'include'
        }
      );
      const data = await response.json();
       if (!response.ok || data.error) {
         console.error("Error fetching customer list:", data.error || response.statusText);
         // Handle potential 401 here too if needed
         return [];
       }
      return data;
    } catch (error) {
      console.error("Error fetching customer list:", error);
      return [];
    }
  };

  const fetchCustomer = async (id) => {
    try {
      const response = await fetch(
          `https://frostmarketing.no/api/customers.php?id=${id}`,
          // *** Add options object with credentials for consistency ***
          {
              method: 'GET', // Explicit method
              credentials: 'include'
          }
      );
      if (!response.ok) {
        let errorMsg = response.statusText;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch (e) { /* Ignore if response is not JSON */ }
        console.error("Error fetching single customer:", errorMsg);
        // Handle potential 401 here too if needed
        return { error: errorMsg };
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching single customer:", error);
      return { error: error.message || 'Network error' };
    }
  };

  const deleteCustomer = async (id) => {
    // This deletes the BUSINESS/CUSTOMER
    try {
      const response = await fetch(
        `https://frostmarketing.no/api/customers.php?id=${id}`,
        {
          method: "DELETE",
          credentials: 'include' // *** Add credentials here ***
          // Removed placeholder Authorization header
        }
      );
      if (!response.ok) {
         let errorMsg = response.statusText;
         try {
           const errorData = await response.json();
           errorMsg = errorData.error || errorMsg;
         } catch(e) { /* Ignore */ }
         console.error("Error deleting customer:", errorMsg);
         // Handle potential 401 here too if needed
         return false;
      }
      // Check if DELETE returns any content before parsing JSON
      // For now, assuming success means response.ok is true
      return true;
    } catch (error) {
      console.error("Error deleting customer:", error);
      return false;
    }
  };

  const updateCustomer = async (customerId, updatedData) => {
    // This updates the BUSINESS/CUSTOMER
    try {
      const payload = {
          id: customerId,
          ...updatedData
      };
      const response = await fetch(
        `https://frostmarketing.no/api/customers.php`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: 'include' // *** Add credentials here ***
        }
      );
      if (!response.ok) {
         let errorMsg = response.statusText;
         try {
           const errorData = await response.json();
           errorMsg = errorData.error || errorMsg;
         } catch (e) { /* Ignore */ }
         console.error("Error updating customer:", errorMsg);
         // Handle potential 401 here too if needed
         return false;
      }
      const result = await response.json();
      console.log("Update customer successful:", result.message || 'Success');
      return true;
    } catch (error) {
      console.error("Error updating customer:", error);
      return false;
    }
  };

  // --- Contact Functions ---

  const fetchContacts = async (businessId) => {
    // Fetches contacts for a specific business
    try {
      const response = await fetch(
        `https://frostmarketing.no/api/contacts.php?business_id=${businessId}`,
        {
            method: 'GET',
            credentials: 'include' // Keep this
        }
      );
      // Improved error handling slightly
      if (!response.ok) {
          let errorMsg = `HTTP error ${response.status}: ${response.statusText}`;
          try {
              const errorData = await response.json();
              errorMsg = errorData.error || errorMsg; // Use specific error from API if available
              if (response.status === 401) {
                  console.error("Auth Error fetching contacts: Server returned 401.", errorMsg);
                  // Potentially trigger logout or redirect here
              } else {
                  console.error("Error fetching contacts:", errorMsg);
              }
          } catch(e) {
               console.error("Error fetching contacts and response was not valid JSON.", response.statusText);
               // If response isn't JSON (like unexpected HTML), log status text
          }
          return []; // Return empty array on error
      }
      // Only parse JSON if response is OK
      const data = await response.json();
      return data; // Assuming success returns an array or valid JSON
    } catch (error) {
      // Network errors or errors during fetch setup
      console.error("Network or other error fetching contacts:", error);
      return [];
    }
  };

  const updateContact = async (contactId, updatedContactData) => {
    // This updates an individual CONTACT
    try {
      const payload = {
          id: contactId,
          ...updatedContactData
      };
      const response = await fetch(
        `https://frostmarketing.no/api/contacts.php`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: 'include' // Keep this
        }
      );
      if (!response.ok) {
         let errorMsg = response.statusText;
         try {
           const errorData = await response.json();
           errorMsg = errorData.error || errorMsg;
         } catch (e) { /* Ignore */ }
         console.error("Error updating contact:", errorMsg);
         // Handle potential 401 here too if needed
         return false;
      }
      const result = await response.json();
      console.log("Update contact successful:", result.message || 'Success');
      return true;
    } catch (error) {
      console.error("Error updating contact:", error);
      return false;
    }
  };

  const deleteContact = async (contactId) => {
    // This deletes an individual CONTACT
    try {
      const response = await fetch(
        `https://frostmarketing.no/api/contacts.php?id=${contactId}`,
        {
          method: "DELETE",
          // No headers needed typically for DELETE if auth is via cookie
          credentials: 'include' // Keep this
        }
      );
      if (!response.ok) {
         let errorMsg = response.statusText;
         try {
           const errorData = await response.json();
           errorMsg = errorData.error || errorMsg;
         } catch(e) { /* Ignore */ }
         console.error("Error deleting contact:", errorMsg);
         // Handle potential 401 here too if needed
         return false;
      }
      return true;
    } catch (error) {
      console.error("Error deleting contact:", error);
      return false;
    }
  };


  // --- Provide ALL functions in the context value ---
  return (
    <ApiContext.Provider
      value={{
        // Customer related
        fetchCustomersList,
        fetchCustomer,
        deleteCustomer, // Deletes the business
        updateCustomer, // Updates the business

        // Contact related
        fetchContacts,
        updateContact,  // Updates a contact
        deleteContact   // Deletes a contact
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};