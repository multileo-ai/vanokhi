import React from "react";
import "./OurStory.css";

export default function OurStory() {
  return (
    <div className="story-page-wrapper">
      {/* 1st: Big Banner + Text */}
      <section className="story-row">
        <div className="full-banner">
          <img src="/banner.png" alt="Vanokhi Banner" />
        </div>
        <div className="story-text-block">
          <h1 className="story-title">OUR LEGACY</h1>
          <p>
            Inspired by the philosophy of The Art of Living Well, Vanokhi
            appreciates the finer things in life and finding joy in everyday.
            Our brand is more than just a label; it's a sweet way of living
            life, cultivating connections, and embracing imperfections.
          </p>
        </div>
      </section>

      {/* 2nd: Two 50% Banners + Text */}
      <section className="story-row">
        <div className="split-grid-50">
          <img src="/brand-ad.jpg" alt="Modern" />
          <img src="/newarivals.png" alt="Heritage" />
        </div>
        <div className="story-text-block">
          <h2 className="story-title">MODERN HERITAGE</h2>
          <p>
            Our design ethos is inspired by contemporary aesthetics presenting
            clothing that is both current and classic. Each piece is designed to
            reflect modern Indian sensibilities, bringing forth an expression
            that is cultured and sophisticated.
          </p>
        </div>
      </section>

      {/* 3rd: Big Banner + Text */}
      <section className="story-row">
        <div className="full-banner">
          <img src="/brand-ad.jpg" alt="Philosophy Banner" />
        </div>
        <div className="story-text-block">
          <h2 className="story-title">CRAFTED FOR YOU</h2>
          <p>
            We believe in creating clothing that resonates with your unique
            identity and style. Designed for individuals with a strong belief in
            tradition, yet possessing a progressive outlook.
          </p>
        </div>
      </section>

      {/* 4th: 30% - 70% Banners + Final Text */}
      <section className="story-row">
        <div className="split-grid-30-70">
          <div className="small-cap">
            <img src="/brand-ad.jpg" alt="Detail" />
          </div>
          <div className="large-cap">
            <img src="/newarivals.png" alt="Vision" />
          </div>
        </div>
        <div className="story-text-block final-block">
          <p className="final-text">— “ द वाह मोमेंट ” —</p>
          <p className="sub-final">Vanokhi | Crafted with Passion</p>
        </div>
      </section>
    </div>
  );
}
