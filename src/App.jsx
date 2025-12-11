import "./App.css";
import Category from "./components/Category";
import HeroCarousel from "./components/HeroCarousel";
import ImageTrail from "./components/ImageTrail";
import InstagramGrid from "./components/InstagramGrid";
import MiniNav from "./components/MiniNav";
import Navbar from "./components/Navbar";
import { useState, useEffect, useRef } from "react";
import TestimonialsGrid from "./components/TestimonialsGrid";
import BrandHero from "./components/BrandHero";
import BrandImage from "./components/BrandImage";
import BrandStory from "./components/BrandStory";
import NewArivals from "./components/NewArivals";
import BrandStoryPage from "./components/BrandStoryPage";

function App() {
  const [isNavWhite, setIsNavWhite] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);

  // Refs to track specific sections
  const whiteSectionRef = useRef(null); // Ref for BrandStoryPage
  const hideSectionRef = useRef(null); // Ref for Testimonials

  useEffect(() => {
    // 1. Observer for WHITE LOGO
    // This creates a detection zone at the very top of the viewport (where the logo lives).
    // rootMargin explanation:
    // - Top: "-10px" (Starts slightly below the top edge)
    // - Bottom: "-90%" (Ignores the bottom 90% of the screen)
    // This ensures the event triggers strictly when the element is behind the navbar area.
    const whiteObserverOptions = {
      root: null,
      rootMargin: "-10px 0px -90% 0px",
      threshold: 0,
    };

    const whiteObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsNavWhite(entry.isIntersecting);
      });
    }, whiteObserverOptions);

    // 2. Observer for HIDING NAVBAR
    const hideObserverOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15,
    };

    const hideObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsNavHidden(entry.isIntersecting);
      });
    }, hideObserverOptions);

    // Start observing
    if (whiteSectionRef.current) whiteObserver.observe(whiteSectionRef.current);
    if (hideSectionRef.current) hideObserver.observe(hideSectionRef.current);

    return () => {
      if (whiteSectionRef.current)
        whiteObserver.unobserve(whiteSectionRef.current);
      if (hideSectionRef.current)
        hideObserver.unobserve(hideSectionRef.current);
    };
  }, []);

  return (
    <div className="app">
      <Navbar isWhite={isNavWhite} isHidden={isNavHidden} />
      <MiniNav />

      <img src="/banner.png" className="bgbanner" alt="" />

      {/* <BrandHero /> */}
      <BrandImage />
      <BrandStory />

      {/* CHANGED: The ref is now here, wrapping BrandStoryPage */}
      <div ref={whiteSectionRef}>
        <BrandStoryPage
          largeImage="/Rectangle 3.png"
          smallImage="/image 2.png"
        />
      </div>

      <Category />
      
      <NewArivals />

      <InstagramGrid />


      {/* Navbar hides when scrolling here */}
      <div ref={hideSectionRef}>
        <TestimonialsGrid />
      </div>

      <footer className="vanokhi-footer">
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
