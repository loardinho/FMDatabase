// Example API calls
export const fetchBusinesses = async () => {
    const response = await fetch("https://frostmarketing.no/api/customers.php");
    const data = await response.json();
    return data;
  };
  
  export const fetchContacts = async () => {
    const response = await fetch("https://frostmarketing.no/api/contacts.php");
    const data = await response.json();
    return data;
  };
  