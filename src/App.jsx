/* src/App.jsx */
import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { db } from "./firebase"; // Adjust path to your firebase config file
import { doc, onSnapshot } from "firebase/firestore";

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
import CollectionPage from "./components/CollectionPage";
import { Toaster } from "react-hot-toast";
import WishlistPage from "./components/WishlistPage";
import SettingsPage from "./components/SettingsPage";
import ProductPage from "./components/ProductPage";
import AdminPanel from "./components/AdminPanel";
import PolicyModal from "./components/PolicyModal";
import AllProducts from "./components/AllProducts";
import FAQModal from "./components/FaqModal";
import OrdersPage from "./components/OrdersPage";

const HomePage = ({
  whiteSectionRef,
  categoryRef,
  hideSectionRef,
  scrollToCategory,
  bannerUrl,
}) => (
  <>
    <img src={bannerUrl || "/banner.png"} className="bgbanner" alt="Banner" />
    <BrandImage scrollToCategory={scrollToCategory} />
    <BrandStory />
    <div ref={whiteSectionRef}>
      <BrandStoryPage largeImage="/Rectangle 3.png" smallImage="/image 2.png" />
    </div>
    <div ref={categoryRef}>
      <Category />
    </div>
    <NewArivals />
    {/* This section triggers the navbar to disappear */}
    <div ref={hideSectionRef}>
      <InstagramGrid />
      <TestimonialsGrid />
    </div>
  </>
);

function AppContent() {
  const [activePolicy, setActivePolicy] = useState(null);
  const [navHidden, setNavHidden] = useState(false);
  const [navWhite, setNavWhite] = useState(false);
  const [bannerUrl, setBannerUrl] = useState("");
  const [faqOpen, setFaqOpen] = useState(false);

  const location = useLocation();
  const isCollectionPage = location.pathname === "/collections";

  const whiteSectionRef = useRef(null);
  const categoryRef = useRef(null);
  const hideSectionRef = useRef(null);

  const scrollToCategory = () =>
    categoryRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const heroDocRef = doc(db, "siteSettings", "hero");

    // This creates a real-time connection to the "hero" document
    const unsubscribe = onSnapshot(heroDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.bannerUrl) {
          setBannerUrl(data.bannerUrl); // Update state with the URL from Admin Panel
        }
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Check if refs are current
      if (whiteSectionRef.current && hideSectionRef.current) {
        const whiteRect = whiteSectionRef.current.getBoundingClientRect();
        const hideRect = hideSectionRef.current.getBoundingClientRect();

        // 1. Color Logic: Set to white when BrandStoryPage is in the viewport
        // It triggers when the top of the section hits the threshold (80px)
        // and stays white until the bottom of the section leaves the top of the screen.
        const isHeaderInWhiteSection =
          whiteRect.top <= 80 && whiteRect.bottom >= 0;
        setNavWhite(isHeaderInWhiteSection);

        // 2. Visibility Logic: Hide when the Instagram Grid ("Our Story") is reached
        // The navbar hides as soon as the InstagramGrid section (hideSectionRef)
        // is 80px or less from the top.
        const hasReachedInstagram = hideRect.top <= 80;
        setNavHidden(hasReachedInstagram);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`app ${isCollectionPage ? "no-scroll" : ""}`}>
      <Toaster position="top-right" containerStyle={{ zIndex: 999999 }} />

      <PolicyModal
        isOpen={!!activePolicy}
        onClose={() => setActivePolicy(null)}
        policyTitle={activePolicy}
      />

      <FAQModal isOpen={faqOpen} onClose={() => setFaqOpen(false)} />

      {!isCollectionPage && (
        <>
          <Navbar isWhite={navWhite} isHidden={navHidden} />
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
              bannerUrl={bannerUrl}
            />
          }
        />
        <Route path="/collections" element={<CollectionPage />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>

      {!isCollectionPage && (
        <footer className="vanokhi-footer">
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
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "10px",
                  }}
                >
                  <img
                    src="/instagram.png"
                    alt="Insta"
                    style={{ width: "20px" }}
                  />
                  @vanokhi.in
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>SUPPORT</h3>
              <ul>
                <li>About Us</li>
                <li
                  onClick={() => setFaqOpen(true)}
                  style={{ cursor: "pointer" }}
                >
                  FAQ'S
                </li>
                <li>Return/Exchange My Order</li>
              </ul>
            </div>
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
