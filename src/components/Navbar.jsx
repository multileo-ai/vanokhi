import React from "react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="vanokhi-navbar" role="navigation" aria-label="Main">
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <h1 className="nav-logo" tabIndex={0}>
          Vanokhi
        </h1>
      </div>
    </nav>
  );
}
