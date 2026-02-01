import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./MiniNav.css";
import { User, ShoppingCart, Search, X } from "lucide-react";
import CartSidebar from "./CartSidebar";
import ProfileSidebar from "./ProfileSidebar";

const MiniNav = () => {
  const { userData } = useAuth();
  const location = useLocation();
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

  const themeClass = isLandingPage ? "landing-mini" : "other-mini";

  const menuRef = useRef(null);
  const searchInputRef = useRef(null);

  const cartItemCount = userData.cart.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

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

  const ActionIcons = () => {
    // Add a check for window width to keep search open on mobile
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
      <div className="nav-action-group">
        {/* Search wrapper is now ALWAYS active if isMobile is true */}
        <div
          className={`search-wrapper ${searchOpen || isMobile ? "active" : ""}`}
        >
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="icon-btn search-trigger"
            onClick={() => !isMobile && setSearchOpen(!searchOpen)}
          >
            <Search className="mini-icon" strokeWidth={1.3} />
          </button>
        </div>

        {/* Profile and Cart buttons remain the same */}
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
    );
  };

  const getPath = (item) => {
    const paths = {
      Collections: "/collections",
      "All Products": "/all-products",
      "Our Roots": "/our-story",
      "New Arrivals": "/new-arrivals",
      Contact: "/contact",
    };
    return paths[item] || "/";
  };

  return (
    <>
      <div className={`mini-nav ${themeClass}`}>
        {/* 1. Dynamic Hamburger Color */}
        <button
          className={`mini-hamburger ${themeClass}`}
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <X className="hamburger-icon-svg" />
          ) : (
            <span className="hamburger-lines" />
          )}
        </button>

        <div className="mini-desktop-nav">
          <div className="desktop-spacer" />
          <ul className="desktop-links">
            {menuItems.map((item, index) => (
              <li key={index} className="mini-link-item">
                <Link to={getPath(item)} className="nav-route-link">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav-actions-container">
          {/* 2. Search visible ONLY on Landing Page in Mobile */}
          {!isLandingPage ? (
            <div className="mobile-hidden-search">
              <ActionIcons hideSearchOnMobile={true} />
            </div>
          ) : (
            <ActionIcons />
          )}
        </div>

        {open && (
          <div ref={menuRef} className="mini-mobile-menu">
            <ul>
              {menuItems.map((item, i) => (
                <li key={i}>
                  <Link
                    to={getPath(item)}
                    className="mini-link-nav"
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
