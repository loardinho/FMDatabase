import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ApiContext } from "../ApiContext"; // Adjust path if needed

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Destructure ALL functions from context now
  const {
    fetchCustomer,
    fetchContacts,
    deleteCustomer, // For the business
    updateCustomer, // For the business
    updateContact,  // For contacts
    deleteContact   // For contacts
  } = useContext(ApiContext);

  // --- State ---
  const [customer, setCustomer] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // General errors

  // State for Business Edit Mode
  const [isEditing, setIsEditing] = useState(false);

  // State for editable Business fields
  const [editedName, setEditedName] = useState('');
  const [editedAddress, setEditedAddress] = useState('');
  const [editedStatusText, setEditedStatusText] = useState('');
  const [editedInformation, setEditedInformation] = useState('');
  const [editedBusinessType, setEditedBusinessType] = useState('');

  // --- State for Contact Editing ---
  const [editingContactId, setEditingContactId] = useState(null); // ID of contact being edited, or null
  const [editedContactData, setEditedContactData] = useState({ // Temp data for contact form
      first_name: '', last_name: '', position: '', email: '', phone: '', information: ''
  });
  const [contactError, setContactError] = useState(''); // Errors specific to contact actions


  // --- Effects ---

  // Combined Fetching Effect for Customer and Contacts
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      setError('');
      setContactError('');
      try {
        const customerData = await fetchCustomer(id);
        if (isMounted) {
          if (customerData && !customerData.error) {
            setCustomer(customerData);
            // Initialize edit fields for customer when data loads
            setEditedName(customerData.business_name || '');
            setEditedAddress(customerData.adresse || '');
            setEditedStatusText(customerData.status || '');
            setEditedInformation(customerData.information || '');
            setEditedBusinessType(customerData.business_type || '');
          } else {
            setError(customerData?.error || 'Failed to load customer details.');
            setCustomer(null);
          }
        }

        // Only fetch contacts if customer loaded successfully
        if (customerData && !customerData.error) {
            const contactsData = await fetchContacts(id);
            if (isMounted) {
              if (Array.isArray(contactsData)) {
                 setContacts(contactsData);
              } else {
                 console.error("Received non-array data for contacts:", contactsData);
                 setContacts([]);
              }
            }
        } else {
             if(isMounted) setContacts([]); // Clear contacts if customer fails to load
        }

      } catch (err) {
        console.error("Error loading data:", err);
        if (isMounted) {
          setError('An error occurred while loading data.');
          setCustomer(null);
          setContacts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
    // Only re-run if the main business ID changes
  }, [id, fetchCustomer, fetchContacts]);


  // --- BUSINESS Handlers ---

  const handleEditToggle = () => {
    if (!isEditing && customer) {
      setEditedName(customer.business_name || '');
      setEditedAddress(customer.adresse || '');
      setEditedStatusText(customer.status || '');
      setEditedInformation(customer.information || '');
      setEditedBusinessType(customer.business_type || '');
      setError('');
    } else {
         setError('');
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!customer) return;
    setError('');
    const updatedData = {
      business_name: editedName,
      adresse: editedAddress,
      status: editedStatusText,
      information: editedInformation,
      business_type: editedBusinessType,
      is_customer: customer.is_customer,
    };
    const success = await updateCustomer(id, updatedData);
    if (success) {
      setCustomer(prev => ({ ...prev, ...updatedData }));
      setIsEditing(false);
    } else {
      setError('Failed to save customer changes. Please try again.');
    }
  };

  const handleDelete = async () => {
    // This deletes the whole BUSINESS
    if (!customer) return;
    const isConfirmed = window.confirm(`DELETE CUSTOMER\nAre you sure you want to delete "${customer.business_name}"? This action cannot be undone.`);
    if (isConfirmed) {
      setError('');
      const success = await deleteCustomer(id);
      if (success) {
        alert('Customer deleted successfully.');
        navigate(location.pathname.includes("existing") ? "/dashboard/existing" : "/dashboard/potential");
      } else {
        setError('Failed to delete customer. Please try again.');
      }
    } else {
      console.log('Customer deletion cancelled.');
    }
  };

  // --- CONTACT Handlers ---

  // Start editing a specific contact
  const handleEditContactClick = (contact) => {
    setEditingContactId(contact.id);
    // Pre-fill edit state with the contact's current data
    setEditedContactData({
        first_name: contact.first_name || '',
        last_name: contact.last_name || '',
        position: contact.position || '',
        email: contact.email || '',
        phone: contact.phone || '',
        information: contact.information || ''
    });
    setContactError(''); // Clear previous contact errors
  };

  // Cancel editing the current contact
  const handleCancelContactEdit = () => {
    setEditingContactId(null);
    setEditedContactData({ first_name: '', last_name: '', position: '', email: '', phone: '', information: '' }); // Clear temp data
    setContactError('');
  };

  // Handle changes in contact input fields
  const handleContactInputChange = (event) => {
    const { name, value } = event.target;
    setEditedContactData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Save changes to the currently edited contact
  const handleSaveContact = async (contactId) => {
    setContactError('');
    // Basic validation example (can add more)
    if (!editedContactData.first_name && !editedContactData.last_name) {
        setContactError("Contact must have at least a first or last name.");
        return;
    }

    const success = await updateContact(contactId, editedContactData);

    if (success) {
      // Update the contacts list in the state
      setContacts(prevContacts =>
        prevContacts.map(contact =>
          contact.id === contactId ? { ...contact, ...editedContactData } : contact
        )
      );
      handleCancelContactEdit(); // Exit edit mode for this contact
    } else {
      setContactError('Failed to save contact changes. Please try again.');
    }
  };

  // Delete a specific contact (with confirmation)
  const handleDeleteContact = async (contactId, contactName) => {
    const isConfirmed = window.confirm(`DELETE CONTACT\nAre you sure you want to delete contact "${contactName}"?`);
    if (isConfirmed) {
      setContactError('');
      const success = await deleteContact(contactId);

      if (success) {
        // Remove the contact from the list in the state
        setContacts(prevContacts => prevContacts.filter(contact => contact.id !== contactId));
        alert('Contact deleted successfully.');
      } else {
        setContactError('Failed to delete contact. Please try again.');
      }
    } else {
      console.log('Contact deletion cancelled.');
    }
  };


  // --- Render Logic ---

  if (loading) return <div className="loading-message">Loading customer details...</div>;
  if (error && !customer) return <div className="error-message">Error: {error}</div>;
  if (!customer) return <div className="not-found-message">Customer not found</div>;

  return (
    <div className="customer-details-container">
      {isEditing ? (
        // --- BUSINESS EDIT MODE ---
        <div className="customer-edit-form">
          <h3>Editing {customer.business_name}</h3>
          {error && <p className="error-message">{error}</p>}
          {/* Customer Edit Form Fields */}
          <div className="form-group">
             <label>Business Name:</label><input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} className="form-input"/>
          </div>
          <div className="form-group">
             <label>Address:</label><input type="text" value={editedAddress} onChange={(e) => setEditedAddress(e.target.value)} className="form-input"/>
          </div>
          <div className="form-group">
             <label>Business Type:</label><input type="text" value={editedBusinessType} onChange={(e) => setEditedBusinessType(e.target.value)} className="form-input"/>
          </div>
          <div className="form-group">
             <label>Status Note:</label><textarea value={editedStatusText} onChange={(e) => setEditedStatusText(e.target.value)} rows="3" className="form-textarea"/>
          </div>
          <div className="form-group">
             <label>Info:</label><textarea value={editedInformation} onChange={(e) => setEditedInformation(e.target.value)} rows="5" className="form-textarea"/>
          </div>
          {/* Action Buttons for Business Edit */}
          <div className="form-actions">
            <button onClick={handleSave} className="button button-save">Save Changes</button>
            <button onClick={handleEditToggle} className="button button-cancel">Cancel</button>
          </div>
        </div>

      ) : (

        // --- BUSINESS VIEW MODE ---
        <div className="customer-view-details">
           {/* Display general error or contact-specific error */}
           {(error || contactError) && <p className="error-message">{error || contactError}</p>}
          <h2>{customer.business_name}</h2>
          <p><strong>Address:</strong> {customer.adresse || 'N/A'}</p>
          <p><strong>Business Type:</strong> {customer.business_type || 'N/A'}</p>
          <p><strong>Status Note:</strong> {customer.status || 'N/A'}</p>
          <p><strong>Info:</strong> {customer.information || 'N/A'}</p>
          <p><strong>Customer Type:</strong> {customer.is_customer === '1' ? 'Existing Customer' : 'Potential Customer'}</p>

          {/* Contacts Section */}
          <h3>Contacts</h3>
          {contacts.length > 0 ? (
            <ul className="contact-list">
              {contacts.map((c) => {
                // Check if the current contact in the loop is the one being edited
                const isEditingThisContact = editingContactId === c.id;

                return (
                  <li key={c.id} className="contact-item"> {/* Add key and maybe class */}
                    {isEditingThisContact ? (
                      // --- CONTACT EDIT MODE (Inline Form) ---
                      <div className="contact-edit-form">
                        {contactError && <p className="error-message">{contactError}</p>} {/* Show contact specific errors here */}
                        <div><input type="text" name="first_name" value={editedContactData.first_name} onChange={handleContactInputChange} placeholder="First Name" className="form-input small-input"/></div>
                        <div><input type="text" name="last_name" value={editedContactData.last_name} onChange={handleContactInputChange} placeholder="Last Name" className="form-input small-input"/></div>
                        <div><input type="text" name="position" value={editedContactData.position} onChange={handleContactInputChange} placeholder="Position" className="form-input small-input"/></div>
                        <div><input type="email" name="email" value={editedContactData.email} onChange={handleContactInputChange} placeholder="Email" className="form-input small-input"/></div>
                        <div><input type="tel" name="phone" value={editedContactData.phone} onChange={handleContactInputChange} placeholder="Phone" className="form-input small-input"/></div>
                        <div><textarea name="information" value={editedContactData.information} onChange={handleContactInputChange} placeholder="Info" rows="2" className="form-textarea small-textarea"/></div>
                        <button onClick={() => handleSaveContact(c.id)} className="button button-save small-button">Save</button>
                        <button onClick={handleCancelContactEdit} className="button button-cancel small-button">Cancel</button>
                      </div>
                    ) : (
                      // --- CONTACT VIEW MODE ---
                      <div className="contact-view">
                        <span> {/* Wrap text for better layout control */}
                          {c.first_name} {c.last_name} ({c.position || 'N/A'}) - {c.email || 'N/A'}, {c.phone || 'N/A'} [{c.information || 'N/A'}]
                        </span>
                        {/* Buttons appear only when NOT editing the main customer */}
                        {!isEditing && (
                          <span className="contact-actions"> {/* Wrap buttons */}
                            <button onClick={() => handleEditContactClick(c)} className="button button-edit small-button">Edit</button>
                            <button onClick={() => handleDeleteContact(c.id, `${c.first_name} ${c.last_name}`)} className="button button-delete small-button">Delete</button>
                          </span>
                        )}
                      </div>
                    )}
                  </li>
                ); // End return for map item
              })} {/* End contacts.map */}
            </ul>
          ) : (
            <p>No contacts found for this customer.</p>
          )}
           {/* Optionally add an "Add Contact" button here */}
           {/* <button className="button">Add New Contact</button> */}


          {/* Action Buttons for the BUSINESS - only show when not editing a contact */}
          {!editingContactId && (
             <div className="detail-actions">
                <button onClick={handleEditToggle} className="button button-edit">Edit Customer Details</button>
                <button onClick={handleDelete} className="button button-delete">Delete This Customer</button>
             </div>
          )}

        </div> // End customer-view-details
      )} {/* End main isEditing ternary */}
    </div> // End customer-details-container
  );
}

export default CustomerDetails;