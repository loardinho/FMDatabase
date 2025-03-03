import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import "../style.css";

function CustomerDashboard() {
  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard!</h1>

      {/* navig. bar */}
      <nav className="dashboard-nav">
        {}
        <NavLink
          to="/dashboard/existing"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          Existing Customers
        </NavLink>

        <NavLink
          to="/dashboard/potential"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          Potential Customers
        </NavLink>

        <NavLink
          to="/dashboard/import-export"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          Import/Export
        </NavLink>
      </nav>

      {/* The child route pages (MainMenu, ExistingCustomers, etc.) will be rendered here */}
      <Outlet />
    </div>
  );
}

export default CustomerDashboard;
