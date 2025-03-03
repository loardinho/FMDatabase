import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

function CustomerDetails() {
  const { id } = useParams();           // :id from  URL
  const navigate = useNavigate();
  const location = useLocation();

  //Demo
 
  const [customers] = useState([
    {
      id: 1,
      business_name: "Al Inc",
      is_customer: 1,
      address: "Oslo, Norway",
      status: "Active",
      info: "Some notes about AL Inc",
      contacts: [
        { id: 101, first_name: "Ben", last_name: "Benson", email: "ben@example.com" },
      ],
    },
    {
      id: 2,
      business_name: "Tech",
      is_customer: 1,
      address: "Bergen, Norway",
      status: "Pending",
      info: "Some notes about Tech",
      contacts: [],
    },
    {
      id: 3,
      business_name: "Metro",
      is_customer: 0,
      address: "Trondheim, Norway",
      status: "Negotiation",
      info: "Potential client, in negotiations",
      contacts: [
        { id: 200, first_name: "Mel", last_name: "Melson", email: "mel@example.com" },
      ],
    },
    
  ]);

  //  the *specific* customer 
  const [customer, setCustomer] = useState(null);

  //  adding a new contact
  const [newContact, setNewContact] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  // editing an existing contact
  const [editContactId, setEditContactId] = useState(null);
  const [editContactData, setEditContactData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  // When component mounts or `id` changes, find the matching customer
  useEffect(() => {
    const found = customers.find((c) => c.id === Number(id));
    setCustomer(found || null);
  }, [id, customers]);

  //  CUSTOMER-LEVEL ACTIONS
 
  // for demonstration

  const handleDeleteCustomer = () => {
    // In a real app, you'd remove the customer from your global state or call an API.
    // Then navigate back to /dashboard/existing or /dashboard/potential
    if (location.pathname.includes("existing")) {
      navigate("/dashboard/existing");
    } else {
      navigate("/dashboard/potential");
    }
  };

  
  //   CONTACT LEVEL ACTIONS
  

  // Add contact
  const handleAddContact = (e) => {
    e.preventDefault();
    if (!customer) return;

    const newId = Date.now(); 
    const updatedContacts = [
      ...customer.contacts,
      { id: newId, ...newContact },
    ];

    setCustomer({ ...customer, contacts: updatedContacts });

    // Clear form
    setNewContact({ first_name: "", last_name: "", email: "" });
  };

  // Prepare edit mode
  const handleEditContact = (contact) => {
    setEditContactId(contact.id);
    setEditContactData({
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
    });
  };

  // Save contact changes
  const handleSaveContact = (e) => {
    e.preventDefault();
    if (!customer) return;

    const updatedContacts = customer.contacts.map((c) =>
      c.id === editContactId ? { ...c, ...editContactData } : c
    );

    setCustomer({ ...customer, contacts: updatedContacts });
    setEditContactId(null);  // exit edit mode
  };

  // Delete ther contact
  const handleDeleteContact = (contactId) => {
    if (!customer) return;
    const updatedContacts = customer.contacts.filter((c) => c.id !== contactId);
    setCustomer({ ...customer, contacts: updatedContacts });
  };

  // If no matching customer found
  if (!customer) {
    return <div>Loading or no customer found for ID: {id}</div>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Details for {customer.business_name}</h2>
      <p><strong>Address:</strong> {customer.address}</p>
      <p><strong>Status:</strong> {customer.status}</p>
      <p><strong>Info:</strong> {customer.info}</p>

      <button onClick={handleDeleteCustomer}>Delete This Customer</button>

      <hr />

      {/* CONTACTS SECTION */}
      <h3>Contacts</h3>
      <ul>
        {customer.contacts.map((contact) => (
          <li key={contact.id} style={{ marginBottom: "0.5rem" }}>
            {editContactId === contact.id ? (
              // EDIT MODE
              <form onSubmit={handleSaveContact}>
                <input
                  type="text"
                  value={editContactData.first_name}
                  onChange={(e) =>
                    setEditContactData({ ...editContactData, first_name: e.target.value })
                  }
                  placeholder="First Name"
                />
                <input
                  type="text"
                  value={editContactData.last_name}
                  onChange={(e) =>
                    setEditContactData({ ...editContactData, last_name: e.target.value })
                  }
                  placeholder="Last Name"
                />
                <input
                  type="email"
                  value={editContactData.email}
                  onChange={(e) =>
                    setEditContactData({ ...editContactData, email: e.target.value })
                  }
                  placeholder="Email"
                />
                <button type="submit">Save</button>
                <button onClick={() => setEditContactId(null)}>Cancel</button>
              </form>
            ) : (
              // DISPLAY MODE
              <>
                {contact.first_name} {contact.last_name} ({contact.email})
                {"  "}
                <button onClick={() => handleEditContact(contact)}>Edit</button>
                <button onClick={() => handleDeleteContact(contact.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h4>Add New Contact</h4>
      <form onSubmit={handleAddContact} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={newContact.first_name}
          onChange={(e) => setNewContact({ ...newContact, first_name: e.target.value })}
          placeholder="First Name"
        />
        <input
          type="text"
          value={newContact.last_name}
          onChange={(e) => setNewContact({ ...newContact, last_name: e.target.value })}
          placeholder="Last Name"
        />
        <input
          type="email"
          value={newContact.email}
          onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
          placeholder="Email"
        />
        <button type="submit">Add Contact</button>
      </form>
    </div>
  );
}

export default CustomerDetails;
