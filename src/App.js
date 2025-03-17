import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/CustomerDashboard';
import PotentialCustomers from './Components/PotentialCustomers';
import ExistingCustomers from './Components/ExistingCustomers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="./Components/CustomerDashboard" element={<Home />} />
        <Route path="./Components/Potential-customers" element={<PotentialCustomers />} />
        <Route path="./Components/Existing-customers" element={<ExistingCustomers />} />
      </Routes>
    </Router>
  );
}

export default App;
