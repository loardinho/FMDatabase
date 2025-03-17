import React, { createContext, useState, useEffect } from "react";

// Create the context
export const ApiContext = createContext();

// ApiProvider component
export const ApiProvider = ({ children }) => {
  const [businesses, setBusinesses] = useState([]);
  const [contacts, setContacts] = useState({});
  const [loading, setLoading] = useState(true);
  const [isCustomer, setIsCustomer] = useState(1); // Default to 1 (customers)

  // Fetch businesses (customers or potential customers)
  const fetchBusinesses = async () => {
    try {
      const response = await fetch(
        `https://frostmarketing.no/api/customers.php?is_customer=${isCustomer}`
      );
      const data = await response.json();
      setBusinesses(data);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  };

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const response = await fetch("https://frostmarketing.no/api/contacts.php");
      const data = await response.json();
      const contactsByBusiness = {};

      data.forEach((contact) => {
        if (!contactsByBusiness[contact.business_id]) {
          contactsByBusiness[contact.business_id] = [];
        }
        contactsByBusiness[contact.business_id].push(contact);
      });

      setContacts(contactsByBusiness);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  // Fetch specific customer by ID
  const fetchCustomer = async (id) => {
    try {
      const response = await fetch(`https://frostmarketing.no/api/customers.php?id=${id}`);
      if (!response.ok) throw new Error("Customer not found");
      return await response.json();
    } catch (error) {
      console.error("Error fetching customer:", error);
      return null; // Return null if there's an error fetching the customer
    }
  };

  // Delete a customer
  const deleteCustomer = async (id) => {
    try {
      const response = await fetch(
        `https://frostmarketing.no/api/customers.php?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setBusinesses((prev) => prev.filter((business) => business.id !== id)); // Update local state
      }
      return response.ok;
    } catch (error) {
      console.error("Error deleting customer:", error);
      return false;
    }
  };

  // Fetch data on startup
  useEffect(() => {
    setLoading(true);
    fetchBusinesses();
    fetchContacts();
  }, [isCustomer]);

  useEffect(() => {
    if (businesses.length > 0 && Object.keys(contacts).length > 0) {
      setLoading(false);
    }
  }, [businesses, contacts]);

  return (
    <ApiContext.Provider
      value={{
        businesses,
        contacts,
        loading,
        setIsCustomer,
        fetchCustomer,
        deleteCustomer,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
