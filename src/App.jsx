import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";

// Component Imports
import Navbar from "./components/Navbar";
import MiniNav from "./components/MiniNav";
import BrandImage from "./components/BrandImage";
import BrandStory from "./components/BrandStory";
import BrandStoryPage from "./components/BrandStoryPage";
import Category from "./components/Category";
import NewArivals from "./components/NewArivals";
import InstagramGrid from "./components/InstagramGrid";
import TestimonialsGrid from "./components/TestimonialsGrid";
import ImageTrail from "./components/ImageTrail";
import CollectionPage from "./components/CollectionPage"; // Ensure you created this file

// 1. Landing Page Sub-Component for clarity
const HomePage = ({
  whiteSectionRef,
  hideSectionRef,
  categoryRef,
  scrollToCategory,
}) => (
  <>
    <img src="/banner.png" className="bgbanner" alt="" />
    <BrandImage scrollToCategory={scrollToCategory} />
    <BrandStory />
    <div ref={whiteSectionRef}>
      <BrandStoryPage largeImage="/Rectangle 3.png" smallImage="/image 2.png" />
    </div>
    <div ref={categoryRef}>
      <Category />
    </div>
    <NewArivals />
    <InstagramGrid />
    <div ref={hideSectionRef}>
      <TestimonialsGrid />
    </div>
  </>
);

// 2. Main content wrapper that uses location hooks
function AppContent() {
  const [isNavWhite, setIsNavWhite] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const location = useLocation();

  const whiteSectionRef = useRef(null);
  const hideSectionRef = useRef(null);
  const categoryRef = useRef(null);

  const scrollToCategory = () => {
    categoryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Scroll to top on every route change
    window.scrollTo(0, 0);

    // If we are NOT on the home page, the navbar should probably stay white/visible
    if (location.pathname !== "/") {
      setIsNavWhite(true);
      return;
    }

    const whiteObserver = new IntersectionObserver(
      (entries) => setIsNavWhite(entries[0].isIntersecting),
      { rootMargin: "-10px 0px -90% 0px" }
    );

    if (whiteSectionRef.current) whiteObserver.observe(whiteSectionRef.current);
    return () => whiteObserver.disconnect();
  }, [location]);

  return (
    <div className="app">
      <Navbar isWhite={isNavWhite} isHidden={isNavHidden} />
      <MiniNav />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              whiteSectionRef={whiteSectionRef}
              hideSectionRef={hideSectionRef}
              categoryRef={categoryRef}
              scrollToCategory={scrollToCategory}
            />
          }
        />
        <Route path="/collections" element={<CollectionPage />} />
      </Routes>

      <footer className="vanokhi-footer">
        <div className="footer-trail-wrapper">
          <ImageTrail />
        </div>

        <div className="footer-glow" />

        <div className="footer-header">
          <h1 className="vanokhi-logo">Vanokhi</h1>
          <p
            className="vanokhi-tagline"
            onClick={scrollToCategory}
            style={{ cursor: "pointer" }}
          >
            — “ द वाह मोमेंट ” —
          </p>
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

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
