import React from "react";
import "./BrandImage.css";

export default function BrandImage({ scrollToCategory }) {
  return (
    <section className="brand-image-outer2" aria-label="Brand image">
      <div
        className="brand-image-viewport2"
        role="img"
        aria-label="Vanokhi brand image"
      >
        <div className="hero-overlay2" />
        <div 
          className="hero-center-badge2" 
          aria-hidden
          onClick={scrollToCategory}
          style={{ cursor: "pointer" }}
        >
          <span className="badge-text2"> “द वाह मोमेंट”</span>
        </div>
      </div>
    </section>
  );
}