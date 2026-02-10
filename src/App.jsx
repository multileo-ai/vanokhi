/* src/App.jsx */
import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Link } from "react-router-dom";
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
// import CollectionPage from "./components/CollectionPage";
import { Toaster } from "react-hot-toast";
import WishlistPage from "./components/WishlistPage";
import SettingsPage from "./components/SettingsPage";
// import ProductPage from "./components/ProductPage";
// import AdminPanel from "./components/AdminPanel";
import PolicyModal from "./components/PolicyModal";
import AllProducts from "./components/AllProducts";
import FAQModal from "./components/FaqModal";
import OrdersPage from "./components/OrdersPage";
import OurStory from "./components/OurStory";
import ScrollToTop from "./components/ScrollToTop";
import NewArrivalsPage from "./components/NewArrivalsPage";
import MostWantedPage from "./components/MostWantedPage";
import ContactUs from "./components/ContactUs";
import ReturnPortal from "./components/ReturnPortal";
import SearchResults from "./components/SearchResults";

const AdminPanel = lazy(() => import("./components/AdminPanel"));
const ProductPage = lazy(() => import("./components/ProductPage"));
const CollectionPage = lazy(() => import("./components/CollectionPage"));

const HomePage = ({
  whiteSectionRef,
  categoryRef,
  hideSectionRef,
  newArrivalsRef,
  scrollToCategory,
  bannerUrl,
  mobileBannerUrl,
}) => (
  <>
    <img
      src={bannerUrl || "/banner.png"}
      className="bgbanner"
      alt="Banner"
      key={bannerUrl || ""} // Adding a key forces a re-render when the URL changes
    />
    <img
      src={mobileBannerUrl || "/banner.png"}
      className="bgbanner1"
      alt="Banner"
      key={mobileBannerUrl || " "} // Adding a key forces a re-render when the URL changes
    />
    <BrandImage scrollToCategory={scrollToCategory} />
    <BrandStory />

    {/* Trigger for WHITE color */}
    <div ref={whiteSectionRef}>{/* <BrandStoryPage /> */}</div>

    <div ref={categoryRef}>
      <Category />
    </div>

    {/* Trigger for HIDING navbar */}
    <div ref={hideSectionRef}>
      <div ref={newArrivalsRef}>
        <NewArivals />
      </div>
      <InstagramGrid />
      <TestimonialsGrid />
    </div>
  </>
);

function AppContent() {
  const [activePolicy, setActivePolicy] = useState(null);
  const [navHidden, setNavHidden] = useState(false);
  const [navWhite, setNavWhite] = useState(false);
  const [navRed, setNavRed] = useState(false);
  const [bannerUrl, setBannerUrl] = useState("");
  const [mobileBannerUrl, setMobileBannerUrl] = useState("");

  const [faqOpen, setFaqOpen] = useState(false);

  const location = useLocation();
  const isCollectionPage = location.pathname === "/collections";

  const whiteSectionRef = useRef(null);
  const categoryRef = useRef(null);
  const hideSectionRef = useRef(null);
  const newArrivalsRef = useRef(null);

  const scrollToCategory = () =>
    categoryRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const heroDocRef = doc(db, "siteSettings", "hero");

    // Add an error handler to prevent the "Permission Denied" from crashing the app
    const unsubscribe = onSnapshot(heroDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.bannerUrl) setBannerUrl(data.bannerUrl);
          if (data.mobileBannerUrl) setMobileBannerUrl(data.mobileBannerUrl);
        }
      },
      (error) => {
        // Log the error instead of letting it bubble up and trigger an assertion failure
        console.error("Firestore Hero Listener failed:", error.message);
      }
    );

    return () => {
      // Immediate cleanup to prevent listener firing during unmount
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate rectangles safely (may be undefined)
      const hideRect = hideSectionRef.current?.getBoundingClientRect();
      const hasReachedInstagram = !!hideRect && hideRect.top <= 80;

      const naRect = newArrivalsRef.current?.getBoundingClientRect();
      const passedNewArrivals = !!naRect && naRect.bottom <= 0; // we scrolled past it

      const whiteRect = whiteSectionRef.current?.getBoundingClientRect();
      const isHeaderInWhiteSection =
        !!whiteRect && whiteRect.top <= 80 && whiteRect.bottom >= 0;

      // Scope the brand-title lookup to the BrandStoryPage container to avoid other pages' elements
      const titleEl = whiteSectionRef.current?.querySelector(".brand-title");
      const titleRect = titleEl?.getBoundingClientRect();
      const nearTitle =
        !!titleRect && titleRect.top <= 160 && titleRect.bottom >= 0;

      const shouldHide = hasReachedInstagram || passedNewArrivals;

      // Debug logs to help diagnose why behavior may not be triggering
      // console.log("NAV SCROLL DEBUG", {
      //   hasReachedInstagram,
      //   passedNewArrivals,
      //   isHeaderInWhiteSection,
      //   nearTitle,
      //   hideRect,
      //   naRect,
      //   whiteRect,
      //   titleRect,
      // });

      setNavHidden(shouldHide);
      setNavWhite(isHeaderInWhiteSection);
      setNavRed(nearTitle);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initialize on load
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
          <Navbar isWhite={navWhite} isHidden={navHidden} isRed={navRed} />
          <MiniNav />
        </>
      )}
      <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                whiteSectionRef={whiteSectionRef}
                categoryRef={categoryRef}
                hideSectionRef={hideSectionRef}
                newArrivalsRef={newArrivalsRef}
                scrollToCategory={scrollToCategory}
                bannerUrl={bannerUrl}
                mobileBannerUrl={mobileBannerUrl}
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
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/new-arrivals" element={<NewArrivalsPage />} />
          <Route path="/most-wanted" element={<MostWantedPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/return-portal" element={<ReturnPortal />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </Suspense>

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
                <li>Email: Vanokhi.in@gmail.com</li>
                <li>
                  <a
                    href="https://www.instagram.com/vanokhi.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src="/instagram.png"
                      alt="Insta"
                      style={{ width: "20px" }}
                    />
                    @vanokhi.in
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>SUPPORT</h3>
              <ul>
                <li>
                  <Link
                    to="/our-story"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    About Us
                  </Link>
                </li>
                <li
                  onClick={() => setFaqOpen(true)}
                  style={{ cursor: "pointer" }}
                >
                  FAQ'S
                </li>
                <li>
                  <Link
                    to="/contact"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/return-portal"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Return/Exchange My Order
                  </Link>
                </li>
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
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
