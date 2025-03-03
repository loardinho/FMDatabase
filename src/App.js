// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import CustomerDashboard from "./Components/CustomerDashboard";
import ExistingCustomers from "./Components/ExistingCustomers";
import PotentialCustomers from "./Components/PotentialCustomers";
import CustomerDetails from "./Components/CustomerDetails";
import ImportExport from "./Components/ImportExport";
import ProtectedRoute from "./Components/ProtectedRoute";




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        >
           <Route index element={<Navigate to="/dashboard" />} />
  
          <Route path="existing" element={<ExistingCustomers />} />
          {}
          <Route path="existing/:id" element={<CustomerDetails />} />

          <Route path="potential" element={<PotentialCustomers />} />
          {}
          <Route path="potential/:id" element={<CustomerDetails />} />

          <Route path="import-export" element={<ImportExport />} />
         
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
