import React from 'react';
import { Link } from 'react-router-dom';

function MainMenu() {
    return (
      <div className="main-menu">
        <h2>Main Menu</h2>
        <ul className="main-menu-list">
          <li><Link to="/dashboard/existing" className="nav-link">Existing Customers</Link></li>
          <li><Link to="/dashboard/potential" className="nav-link">Potential Customers</Link></li>
          <li><Link to="/dashboard/import-export" className="nav-link">Import/Export</Link></li>
        </ul>
      </div>
    );
  }
  

export default MainMenu;
