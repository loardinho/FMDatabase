import React, { createContext, useState, useEffect } from "react";
import { fetchBusinesses, fetchContacts } from "../services/api";

// Create context
export const ApiContext = createContext();

// API Context Provider
export const ApiProvider = ({ children }) => {
  const [businesses, setBusinesses] = useState([]);
  const [contacts, setContacts] = useState([]);

  // Fetch businesses and contacts when component mounts
  useEffect(() => {
    const getBusinesses = async () => {
      const businessesData = await fetchBusinesses();
      setBusinesses(businessesData);
    };

    const getContacts = async () => {
      const contactsData = await fetchContacts();
      setContacts(contactsData);
    };

    getBusinesses();
    getContacts();
  }, []);

  // Function to delete a customer
  const deleteCustomer = (id) => {
    setBusinesses(businesses.filter((business) => business.id !== id));
  };

  return (
    <ApiContext.Provider value={{ businesses, contacts, deleteCustomer }}>
      {children}
    </ApiContext.Provider>
  );
};
