import React from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Sidebar.css"; // optional, for custom tweaks

const Sidebar = () => {
  return (
    <div className="d-flex flex-column bg-light vh-100 p-3" style={{ width: "250px" }}>
      <h4 className="text-center mb-4">Admin Panel</h4>
      <nav className="nav flex-column">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active text-primary fw-bold" : "text-dark"}`
          }
        >
          Candidate Management
        </NavLink>

        <NavLink
          to="/employee-list"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active text-primary fw-bold" : "text-dark"}`
          }
        >
          Employee Management
        </NavLink>

        <NavLink
          to="/attendence"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active text-primary fw-bold" : "text-dark"}`
          }
        >
          Attendance Management
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
