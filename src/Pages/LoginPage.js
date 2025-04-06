import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import "../style.css";

function LoginPage() {
    // --- React State ---
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    // --- Handle Form Submission ---
// --- Handle Form Submission ---
const handleSubmit = async (event) => {
  event.preventDefault(); 
  setErrorMessage(''); 

  if (!username || !password) {
      setErrorMessage('Please enter username and password.');
      return;
  }

  try {
      const response = await fetch('https://frostmarketing.no/login_validation/api_login.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          // credentials: 'include', // Still might be needed depending on CORS/cookies
          body: JSON.stringify({ username: username, password: password }),
      });

      const data = await response.json();

      if (data.success) {
          console.log('Login successful!');
          
          // *** ADD THIS LINE ***
          // Set the flag in localStorage that ProtectedRoute checks
          localStorage.setItem("isAuthenticated", "true"); 
          // *** --- --- --- ***

          // Now navigate
          navigate('/dashboard'); 
      } else {
          console.error('Login failed:', data.message);
          setErrorMessage(data.message || 'Login failed.');
          // Make sure you DON'T set the localStorage item if login fails
      }

  } catch (error) {
      console.error('Error during login fetch:', error);
      setErrorMessage('An error occurred during login. Please try again.');
  }
};

    // --- Render the Login Form using JSX ---
    return (
        <div className="login-container"> {/* Add a container for styling */}
            <div className="login-form">
                <h2>Login</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error messages */}
                {/* Use the handleSubmit function for the form's onSubmit */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        {/* Controlled inputs: value linked to state, onChange updates state */}
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

// --- VERY IMPORTANT: Export the component as default ---
export default LoginPage;