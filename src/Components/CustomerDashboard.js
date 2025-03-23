import React from "react";
import { Outlet, NavLink } from "react-router-dom";

function CustomerDashboard() {
  return (
    <div className="dashboard-container">
      <h1>The Customer Database</h1>
      {}
      <nav>
        <NavLink to="/dashboard/existing">Existing Customers</NavLink>{" "}
        <NavLink to="/dashboard/potential">Potential Customers</NavLink>{" "}
        <NavLink to="/dashboard/import-export">Import/Export</NavLink>
      </nav>

      {}
      <Outlet />
    </div>
  );
}

export default CustomerDashboard;
