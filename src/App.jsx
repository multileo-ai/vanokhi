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
import { Toaster } from "react-hot-toast"; // For the right-side notifications
import WishlistPage from "./components/WishlistPage";
import SettingsPage from "./components/SettingsPage";

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

  const whiteSectionRef = useRef(null);
  const categoryRef = useRef(null);
  const hideSectionRef = useRef(null);

  const scrollToCategory = () =>
    categoryRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className={`app ${isCollectionPage ? "no-scroll" : ""}`}>
      <Toaster position="top-right" reverseOrder={false} />{" "}
      {/* Notification Container */}
      {!isCollectionPage && (
        <>
          <Navbar isWhite={false} isHidden={false} />
          <MiniNav />
        </>
      )}
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
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
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
