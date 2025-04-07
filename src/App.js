import React from "react";
// Import BrowserRouter with alias 'Router', or just BrowserRouter directly
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import Layout from "./Components/Layout";
import { ApiProvider } from './ApiContext'; // Import ApiProvider

import LoginPage from "./Pages/LoginPage";
import ExistingCustomers from "./Components/ExistingCustomers";
import PotentialCustomers from "./Components/PotentialCustomers";
import ImportExport from "./Components/ImportExport";
import CustomerDetails from "./Components/CustomerDetails";

function App() {

  return (
    <ApiProvider> {/* Wrap the app with ApiProvider */}
      {/* Add the basename prop here, matching your repository name */}
      <Router basename="/Database"> {/* <--- MODIFIED THIS LINE */}
        <Routes>
          {/* Login page at the effective root */}
          <Route path="/" element={<LoginPage />} />

          {/* Protected dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Index route redirects to existing customers */}
            <Route index element={<Navigate to="/dashboard/existing" replace />} />
            {/* Use relative paths for nested routes */}
            <Route path="existing" element={<ExistingCustomers />} />
            <Route path="existing/:id" element={<CustomerDetails />} />

            <Route path="potential" element={<PotentialCustomers />} />
            <Route path="potential/:id" element={<CustomerDetails />} />

            <Route path="import-export" element={<ImportExport />} />
          </Route>

          {/* Optional: Add a catch-all route or redirect for invalid paths */}
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}

        </Routes>
      </Router>
    </ApiProvider>
  );
}

export default App;