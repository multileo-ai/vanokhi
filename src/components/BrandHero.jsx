import React from "react";
import "./BrandHero.css";

export default function BrandHero() {
  return (
    <section className="brand-hero-outer" aria-label="Brand hero">
      <div
        className="brand-hero-viewport"
        role="img"
        aria-label="Vanokhi brand image"
        style={{
          backgroundImage: `url("/brand-ad.jpg")`,
        }}
      >
        <div className="hero-overlay" />
        <div className="hero-center-badge" aria-hidden>
          <span className="badge-text">Vanokhi</span>
        </div>
      </div>

      {/* brand-story-box now contains ONLY the typing-slider per your request */}
      <div className="brand-story-box" aria-live="polite">
        <div className="brand-story-inner">
          <div className="typing-slider" aria-hidden="false">
            <p>Vanokhi.</p>
            <p>Culture Reimagined</p>
            <p>Distinct Identity</p>
          </div>
        </div>
      </div>
    </section>
  );
}
