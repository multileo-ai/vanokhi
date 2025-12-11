import React from "react";
import "./Navbar.css";

export default function Navbar({ isWhite, isHidden }) {
  return (
    <nav
      className={`vanokhi-navbar ${isWhite ? "nav-white" : ""} ${
        isHidden ? "nav-hidden" : ""
      }`}
      role="navigation"
      aria-label="Main"
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <h1 className="nav-logo" tabIndex={0}>
          Vanokhi
        </h1>
      </div>
    </nav>
  );
}
