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
import ProductPage from "./components/ProductPage";
import AdminPanel from "./components/AdminPanel";
import PolicyModal from "./components/PolicyModal";
import AllProducts from "./components/AllProducts";

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
  const [activePolicy, setActivePolicy] = useState(null);
  const location = useLocation();
  const isCollectionPage = location.pathname === "/collections";

  const whiteSectionRef = useRef(null);
  const categoryRef = useRef(null);
  const hideSectionRef = useRef(null);

  const scrollToCategory = () =>
    categoryRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className={`app ${isCollectionPage ? "no-scroll" : ""}`}>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerStyle={{
          zIndex: 999999,
        }}
        toastOptions={{
          style: {
            zIndex: 999999,
          },
        }}
      />

      <PolicyModal
        isOpen={!!activePolicy}
        onClose={() => setActivePolicy(null)}
        policyTitle={activePolicy}
      />

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
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      {!isCollectionPage && (
        <footer className="vanokhi-footer">
          <div className="footer-trail-wrapper">{/* <ImageTrail /> */}</div>
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
                <li>Email: support@nishorama.com</li>
                <li className="social-links">
                  <a
                    href="https://www.instagram.com/vanokhi.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    <img
                      src="/instagram.png"
                      alt="Instagram"
                      style={{ width: "24px", height: "24px" }}
                    />
                    @vanokhi.in
                  </a>
                </li>
              </ul>
            </div>

            {/* SUPPORT Section */}
            <div className="footer-column">
              <h3>SUPPORT</h3>
              <ul>
                <li>About Us</li>
                <li>FAQ'S</li>
                <li>Return/Exchange My Order</li>
              </ul>
            </div>

            {/* POLICIES Section */}
            <div className="footer-column">
              <h3>POLICIES</h3>
              <ul>
                <li
                  onClick={() => setActivePolicy("Privacy Policy")}
                  style={{ cursor: "pointer" }}
                >
                  Privacy Policy
                </li>
                <li
                  onClick={() => setActivePolicy("Shipping & Delivery Policy")}
                  style={{ cursor: "pointer" }}
                >
                  Shipping & Delivery Policy
                </li>
                <li
                  onClick={() => setActivePolicy("Return and Exchnage Policy")}
                  style={{ cursor: "pointer" }}
                >
                  Return and Exchnage Policy
                </li>
                <li
                  onClick={() => setActivePolicy("Terms of Service")}
                  style={{ cursor: "pointer" }}
                >
                  Terms of Service
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Vanokhi | Crafted with Passion</p>
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
