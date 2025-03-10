import React from "react";
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
    <ApiProvider> {/* Wrap the app with ApiProvider to provide context */}
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard/existing" />} />
            <Route path="existing" element={<ExistingCustomers />} />
            <Route path="existing/:id" element={<CustomerDetails />} />

            <Route path="potential" element={<PotentialCustomers />} />
            <Route path="potential/:id" element={<CustomerDetails />} />

            <Route path="import-export" element={<ImportExport />} />
          </Route>
        </Routes>
      </Router>
    </ApiProvider>
  );
}

export default App;
