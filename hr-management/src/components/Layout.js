import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <>
      {/* Top Navigation */}
      <Navbar />

      {/* Main content with consistent max width and spacing */}
      <div className="d-flex justify-content-center">
        <div className="container" style={{ maxWidth: "1140px", padding: "20px" }}>
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
