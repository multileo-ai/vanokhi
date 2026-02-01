import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import { useAuth } from "../context/AuthContext";
import "./MiniNav.css";
import { User, ShoppingCart, Search, X } from "lucide-react";
import CartSidebar from "./CartSidebar";
import ProfileSidebar from "./ProfileSidebar";

const MiniNav = () => {
  const { userData } = useAuth();
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate
  const isLandingPage = location.pathname === "/";

  const menuItems = [
    "Collections",
    "All Products",
    "New Arrivals",
    "Our Roots",
    "Contact",
  ];
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const menuRef = useRef(null);
  const searchInputRef = useRef(null);
  const cartItemCount = userData.cart.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle Search Submission
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery(""); // Clear after search
    }
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return;
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      if (e.target.closest(".hamburger-btn")) return;
      setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  const themeClass = isLandingPage ? "landing-mini" : "other-mini";

  return (
    <>
      <div className={`mini-nav ${themeClass}`}>
        <button
          className={`hamburger-btn ${themeClass}`}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          {open ? (
            <X className="hamburger-icon-svg" />
          ) : (
            <span className="hamburger-lines" />
          )}
        </button>

        <div className="mini-desktop-nav">
          <ul className="desktop-links">
            {menuItems.map((item, index) => (
              <li key={index} className="mini-link-item">
                <Link
                  to={
                    item === "Collections"
                      ? "/collections"
                      : item === "All Products"
                      ? "/all-products"
                      : item === "Our Roots"
                      ? "/our-story"
                      : item === "New Arrivals"
                      ? "/new-arrivals"
                      : "/contact"
                  }
                  className="nav-route-link"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-actions-container">
          <div className="nav-action-group">
            {/* Conditional Search Box rendering for Mobile vs Desktop */}
            {(!isMobile || isLandingPage) && (
              <div
                className={`search-wrapper ${
                  searchOpen || (isMobile && isLandingPage) ? "active" : ""
                }`}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  className={`search-input ${themeClass}`}
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
                <button
                  className="icon-btn"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <Search className="mini-icon" strokeWidth={1.3} />
                </button>
              </div>
            )}

            <button className="icon-btn" onClick={() => setProfileOpen(true)}>
              <User className="mini-icon" strokeWidth={1.3} />
            </button>
            <button className="icon-btn" onClick={() => setCartOpen(true)}>
              <div className="cart-badge-container">
                <ShoppingCart className="mini-icon" strokeWidth={1.3} />
                {cartItemCount > 0 && (
                  <span className="cart-count">{cartItemCount}</span>
                )}
              </div>
            </button>
          </div>
        </div>

        {open && (
          <div ref={menuRef} className="mini-mobile-menu">
            <ul>
              {menuItems.map((item, i) => (
                <li key={i}>
                  <Link
                    to={
                      item === "Collections"
                        ? "/collections"
                        : item === "All Products"
                        ? "/all-products"
                        : item === "Our Roots"
                        ? "/our-story"
                        : item === "New Arrivals"
                        ? "/new-arrivals"
                        : "/contact"
                    }
                    onClick={() => setOpen(false)}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <ProfileSidebar
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </>
  );
};

export default MiniNav;
