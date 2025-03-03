// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import CustomerDashboard from "./Components/CustomerDashboard";
import MainMenu from "./Components/MainMenu";
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
          <Route index element={<MainMenu />} />
          <Route path="existing" element={<ExistingCustomers />} />
          {/* Notice :id param in the path */}
          <Route path="existing/:id" element={<CustomerDetails />} />

          <Route path="potential" element={<PotentialCustomers />} />
          {/* Notice :id param in the path */}
          <Route path="potential/:id" element={<CustomerDetails />} />

          <Route path="import-export" element={<ImportExport />} />
         
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
