import React, { createContext, useState } from "react";


export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  
  const fetchCustomersList = async (isCustomerVal = 1) => {
    try {
      const response = await fetch(
        `https://frostmarketing.no/api/customers.php?is_customer=${isCustomerVal}`
      );
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error("Error fetching customer list:", error);
      return [];
    }
  };

  const fetchCustomer = async (id) => {
    try {
      const response = await fetch(`https://frostmarketing.no/api/customers.php?id=${id}`);
      if (!response.ok) throw new Error("Customer not found");
      return await response.json(); 
    } catch (error) {
      console.error("Error fetching single customer:", error);
      return null;
    }
  };

  const fetchContacts = async (businessId) => {
    try {
      const response = await fetch(
        `https://frostmarketing.no/api/contacts.php?business_id=${businessId}`
      );
      if (!response.ok) throw new Error("Contacts fetch failed");
      return await response.json(); 
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return [];
    }
  };

  const deleteCustomer = async (id) => {
    try {
      const response = await fetch(
        `https://frostmarketing.no/api/customers.php?id=${id}`,
        { method: "DELETE" }
      );
      return response.ok;
    } catch (error) {
      console.error("Error deleting customer:", error);
      return false;
    }
  };

  return (
    <ApiContext.Provider
      value={{
        
        fetchCustomersList,
        fetchCustomer,
        fetchContacts,
        deleteCustomer,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
