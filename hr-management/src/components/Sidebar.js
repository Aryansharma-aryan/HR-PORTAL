import React from "react";
import { NavLink } from "react-router-dom";
import "../css/Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <nav className="sidebar-nav">
        <NavLink to="/" className="sidebar-link" activeclassname="active">
          Candidate Management
        </NavLink>
        <NavLink
          to="/employee-list"
          className="sidebar-link"
          activeclassname="active"
        >
          Employee Management
        </NavLink>
        <NavLink
          to="/attendence"
          className="sidebar-link"
          activeclassname="active"
        >
          Attendence Management
        </NavLink>
        {/* Add more links here */}
      </nav>
    </aside>
  );
};

export default Sidebar;
