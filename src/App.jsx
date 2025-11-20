import "./App.css";
import Category from "./components/Category";
import HeroCarousel from "./components/HeroCarousel";
import ImageTrail from "./components/ImageTrail";
import InstagramGrid from "./components/InstagramGrid";
import MiniNav from "./components/MiniNav";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import TestimonialsGrid from "./components/TestimonialsGrid";
import BrandHero from "./components/BrandHero";

function App() {
  return (
    <div className="app">
      <Navbar />
      <MiniNav />

      {/* landing hero: advert image + brand story (typewriter) */}
      <BrandHero />

      <Category />

      <InstagramGrid />

      <TestimonialsGrid />

      <footer className="vanokhi-footer">
        {/* ✅ ImageTrail only inside footer */}
        <div className="footer-trail-wrapper">
          <ImageTrail />
        </div>

        <div className="footer-glow" />

        <div className="footer-header">
          <h1 className="vanokhi-logo">Vanokhi</h1>
          <p className="vanokhi-tagline">— “ द वाह मोमेंट ” —</p>
        </div>

        <div className="footer-sections">
          <div className="footer-column">
            <h3>Explore</h3>
            <ul>
              <li>Home</li>
              <li>Collections</li>
              <li>New Arrivals</li>
              <li>All Products</li>
              <li>Most Wanted</li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>About</h3>
            <ul>
              <li>Our Story</li>
              <li>Ethics & Craft</li>
              <li>Privacy & Policy</li>
              <li>Contact</li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Connect</h3>
            <div className="social-icons">
              <img src="/facebook.png" alt="Facebook" />
              <img src="/instagram.png" alt="Instagram" />
              <img src="/linkdin.png" alt="LinkedIn" />
            </div>
          </div>
        </div>

        <div className="footer-line"></div>
        <div className="footer-bottom">
          <p>© 2025 Vanokhi | Crafted with Passion, Designed for the Future</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
