import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";

// Components
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
import CollectionPage from "./components/CollectionPage";

const HomePage = ({
  whiteSectionRef,
  categoryRef,
  hideSectionRef,
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

function AppContent() {
  const location = useLocation();
  const isCollectionPage = location.pathname === "/collections";

  // Existing Refs
  const whiteSectionRef = useRef(null);
  const categoryRef = useRef(null);
  const hideSectionRef = useRef(null);

  const scrollToCategory = () =>
    categoryRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className={`app ${isCollectionPage ? "no-scroll" : ""}`}>
      {/* Hide Navbar on Collection Page */}
      {!isCollectionPage && <Navbar isWhite={false} isHidden={false} />}

      {/* Keep MiniNav for navigation, but we fix its colors in its own file */}
      <MiniNav />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              whiteSectionRef={whiteSectionRef}
              categoryRef={categoryRef}
              hideSectionRef={hideSectionRef}
              scrollToCategory={scrollToCategory}
            />
          }
        />
        <Route path="/collections" element={<CollectionPage />} />
      </Routes>

      {/* Hide Footer on Collection Page */}
      {!isCollectionPage && (
        <footer className="vanokhi-footer">
          <div className="footer-trail-wrapper">
            <ImageTrail />
          </div>
          <div className="footer-header">
            <h1 className="vanokhi-logo">Vanokhi</h1>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Vanokhi</p>
          </div>
        </footer>
      )}
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
