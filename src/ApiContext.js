import React, { createContext, useState, useEffect } from 'react';

// Lager konteksten
export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
    const [businesses, setBusinesses] = useState([]);
    const [contacts, setContacts] = useState({});
    const [loading, setLoading] = useState(true);
    const [isCustomer, setIsCustomer] = useState(1); // Standard til 1 (kunder)

    // Hent bedrifter, kan filtrere på kunder og ikke-kunder
    const fetchBusinesses = async () => {
        try {
            const response = await fetch(`https://frostmarketing.no/api/customers.php?is_customer=${isCustomer}`); // Endre URL for å filtrere på kunder
            const data = await response.json();
            setBusinesses(data);
        } catch (error) {
            console.error('Error fetching businesses:', error);
        }
    };

    // Hent kontaktpersoner
    const fetchContacts = async () => {
        try {
            const response = await fetch('https://frostmarketing.no/api/contacts.php'); // Hent kontaktpersoner uavhengig av kunder
            const data = await response.json();
            const contactsByBusiness = {};

            // Organisere kontaktpersonene etter business_id
            data.forEach(contact => {
                if (!contactsByBusiness[contact.business_id]) {
                    contactsByBusiness[contact.business_id] = [];
                }
                contactsByBusiness[contact.business_id].push(contact);
            });

            setContacts(contactsByBusiness);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    // Hent data ved komponentens oppstart
    useEffect(() => {
        setLoading(true); // Set loading til true før henting
        fetchBusinesses();
        fetchContacts();
    }, [isCustomer]); // Denne useEffect vil bli trigget når isCustomer endres

    useEffect(() => {
        // Sjekk om vi har hentet både bedrifter og kontakter
        if (businesses.length > 0 && Object.keys(contacts).length > 0) {
            setLoading(false);
        }
    }, [businesses, contacts]); // Denne effekten sørger for at "loading" blir satt til false når begge er lastet

    return (
        <ApiContext.Provider value={{ businesses, contacts, loading, setIsCustomer }}>
            {children}
        </ApiContext.Provider>
    );
};
