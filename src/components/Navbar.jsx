import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ isWhite, isHidden, isRed }) {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  return (
    <nav
      className={`vanokhi-navbar ${isWhite ? "nav-white" : ""} ${
        isRed ? "nav-red" : ""
      } ${isHidden ? "nav-hidden" : ""} ${isLandingPage ? "landing-nav" : "other-nav"}`}
      role="navigation"
      aria-label="Main"
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          textDecoration: "none",
        }}
      >
        {/* Wrapped Logo in a Link to enable navigation back to Home */}
        <Link to="/" className="nav-logo-link">
          <h1 className="nav-logo" tabIndex={0}>
            Vanokhi
          </h1>
        </Link>
      </div>
    </nav>
  );
}

