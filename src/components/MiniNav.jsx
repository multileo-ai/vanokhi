import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom"; // Added missing import
import "./MiniNav.css";
import { User, ShoppingCart, Search, X } from "lucide-react";
import CartSidebar from "./CartSidebar";
import ProfileSidebar from "./ProfileSidebar";

const MiniNav = () => {
  const menuItems = [
    "Collections",
    "All Products",
    "Return & Exchange",
    "New Arrivals",
    "Most Wanted",
    "Our Story",
  ];

  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const menuRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (mobileSearchOpen && mobileInputRef.current)
      mobileInputRef.current.focus();
  }, [mobileSearchOpen]);

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

  return (
    <>
      <div className="mini-nav" role="navigation">
        <button
          className="hamburger-btn"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          <span className="hamburger-lines" />
        </button>

        <div className="mini-desktop-nav">
          <div className="desktop-spacer" />
          <ul className="desktop-links">
            {menuItems.map((item, index) => (
              <li key={index} className="mini-link-item">
                {/* Fixed the ReferenceError by importing Link above */}
                <Link
                  to={item === "Collections" ? "/collections" : "/"}
                  className="nav-route-link"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>

          <div className="desktop-icons">
            <div className={`search-wrapper ${searchOpen ? "active" : ""}`}>
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="icon-btn"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="mini-icon" strokeWidth={1.3} />
              </button>
            </div>
            <button className="icon-btn" onClick={() => setProfileOpen(true)}>
              <User className="mini-icon" strokeWidth={1.3} />
            </button>
            <button className="icon-btn" onClick={() => setCartOpen(true)}>
              <div className="cart-badge-container">
                <ShoppingCart className="mini-icon" strokeWidth={1.3} />
                <span className="cart-count">2</span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div ref={menuRef} className="mini-mobile-menu">
            <ul>
              {menuItems.map((item, i) => (
                <li key={i}>
                  <Link
                    to={item === "Collections" ? "/collections" : "/"}
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
