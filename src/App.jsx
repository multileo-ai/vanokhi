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
import BrandImage from "./components/BrandImage";
import BrandStory from "./components/BrandStory";
import NewArivals from "./components/NewArivals";

function App() {
  return (
    <div className="app">
      <Navbar />
      <MiniNav />

      {/* landing hero image and brand story (separate components) */}
      <img src="/public/banne.png" className="bgbanner" alt="" />
      <BrandImage />
      <BrandStory />

      <Category />

      <InstagramGrid />

      <NewArivals />

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
            <h3>CONTACT US</h3>
            <ul>
              <li>Corporate Office Address: Kharadi Bypass, Pune</li>
              <li>Email: support@nishorama.com </li>
              <li>Mob: +91 9511948736</li>
              <li>Opening Hours: Mon to Sat: 10:30 AM - 6:30 PM</li>
              <li>Most Wanted</li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>SUPPORT</h3>
            <ul>
              <li>About Us </li>
              <li>FAQ'S</li>
              <li>Return/Exchange My Order</li>
              <li>Return and Exchnage Policy</li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>POLICIES</h3>
            <ul>
              <li>Privacy Policy </li>
              <li>Shipping & Delivery Policy </li>
              <li>Terms of Service </li>
            </ul>
          </div>

          {/* <div className="footer-column">
            <h3>POLICIES</h3>
            <div className="social-icons">
              <img src="/facebook.png" alt="Facebook" />
              <img src="/instagram.png" alt="Instagram" />
              <img src="/linkdin.png" alt="LinkedIn" />
            </div>
          </div> */}
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
