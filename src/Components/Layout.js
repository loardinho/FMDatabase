// Layout.js (example)
import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import "../style.css";

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  return (
    <div className="layout-container">
      <header className="app-header">
        <h1 className="app-title">The Customer Database</h1>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt style={{ marginRight: "5px" }} />
          Logout
        </button>
      </header>

      {}
      <nav className="dashboard-nav">
        <NavLink 
          to="/dashboard/existing" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          Existing Customers
        </NavLink>
        <NavLink 
          to="/dashboard/potential" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          Potential Customers
        </NavLink>
        <NavLink 
          to="/dashboard/import-export" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          Import/Export
        </NavLink>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
