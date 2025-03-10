import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [customer, setCustomer] = useState(null);

  // 1) Fetch the single customer using the "id" from the URL
  useEffect(() => {
    fetch(`https://frostmarketing.no/api/customers.php?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCustomer(data);
      })
      .catch(console.error);
  }, [id]);

  // STATES FOR NEW/EDIT CONTACT
  const [newContact, setNewContact] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [editContactId, setEditContactId] = useState(null);
  const [editContactData, setEditContactData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  // Delete Customer 
  const handleDeleteCustomer = () => {
    fetch(`https://frostmarketing.no/api/customers.php?id=${id}`

    )
    if (location.pathname.includes("existing")) {
      navigate("/dashboard/existing");
    } else {
      navigate("/dashboard/potential");
    }
  };

 //Contact
  const handleAddContact = (e) => {
    e.preventDefault();
    if (!customer) return;
    const newId = Date.now();
    const updatedContacts = [...customer.contacts, { id: newId, ...newContact }];
    setCustomer({ ...customer, contacts: updatedContacts });
    setNewContact({ first_name: "", last_name: "", email: "", phone: "" });
  };

  const handleEditContact = (contact) => {
    setEditContactId(contact.id);
    setEditContactData({ ...contact });
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    if (!customer) return;
    const updatedContacts = customer.contacts.map((c) =>
      c.id === editContactId ? { ...c, ...editContactData } : c
    );
    setCustomer({ ...customer, contacts: updatedContacts });
    setEditContactId(null);
  };

  const handleDeleteContact = (contactId) => {
    if (!customer) return;
    const updatedContacts = customer.contacts.filter((c) => c.id !== contactId);
    setCustomer({ ...customer, contacts: updatedContacts });
  };


  if (!customer) {
    return <div>Loading or no customer found for ID: {id}</div>;
  }

 
  return (
    <div style={{ padding: "1rem" }}>
      <h2>Details for {customer.business_name}</h2>
      <p>
        <strong>Address:</strong> {customer.address}
      </p>
      <p>
        <strong>Status:</strong> {customer.status}
      </p>
      <p>
        <strong>Info:</strong> {customer.info}
      </p>

      <button onClick={handleDeleteCustomer}>Delete This Customer</button>

      <hr />

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
                <input
                  type="phone"
                  value={editContactData.phone}
                  onChange={(e) =>
                    setEditContactData({ ...editContactData, phone: e.target.value })
                  }
                  placeholder="Phone"
                />
                <button type="submit">Save</button>
                <button onClick={() => setEditContactId(null)}>Cancel</button>
              </form>
            ) : (
              // DISPLAY MODE
              <>
                {contact.first_name} {contact.last_name} ({contact.email}, {contact.phone}){" "}
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
        <input
          type="phone"
          value={newContact.phone}
          onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
          placeholder="Phone"
        />
        <button type="submit">Add Contact</button>
      </form>
    </div>
  );
}

export default CustomerDetails;
