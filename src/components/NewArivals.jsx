// src/components/NewArivals.jsx
import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./NewArivals.css";

const NewArivals = () => {
  return (
    <section className="brand-image-outer1" aria-label="Brand image">
      <div
        className="brand-image-viewport1"
        role="img"
        aria-label="Vanokhi brand image"
      >
        <div className="hero-overlay1" />
        <div className="hero-center-badge1" aria-hidden>
          {/* Wrap the text in a Link and point it to your route */}
          <Link to="/new-arrivals" className="badge-text1" style={{ textDecoration: 'none', color: 'inherit' }}>
            NEW ARRIVALS
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArivals;