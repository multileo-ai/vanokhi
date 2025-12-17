import React, { useState, useRef, useEffect } from "react";
import "./MiniNav.css";
import { User, ShoppingCart, Search, X } from "lucide-react"; // Added X icon
import CartSidebar from "./CartSidebar";
import ProfileSidebar from "./ProfileSidebar";

const MiniNav = () => {
  const menuItems = [
    "Collections",
    "All Products",
    "Return & Exchange", // Shortened slightly for space
    "New Arrivals",
    "Most Wanted",
    "Our Story",
  ];

  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false); // Separate state for mobile
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const menuRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  // Focus Desktop Input
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Focus Mobile Input
  useEffect(() => {
    if (mobileSearchOpen && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  // Close menus on click outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return;
      const target = e.target;
      if (
        (menuRef.current && menuRef.current.contains(target)) ||
        (target.closest && target.closest(".hamburger-btn"))
      ) {
        return;
      }
      setOpen(false);
      setMobileSearchOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  const handleToggle = (e) => {
    e.stopPropagation();
    setOpen((v) => !v);
    setMobileSearchOpen(false); // Reset mobile search on toggle
  };

  const handleNavClick = (item) => {
    if (item.toLowerCase().includes("our story")) {
      const el = document.getElementById("brand-story");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setOpen(false);
  };

  return (
    <>
      <div className="mini-nav" role="navigation" aria-label="Mini">
        {/* Mobile Hamburger */}
        <button
          type="button"
          className="hamburger-btn"
          aria-expanded={open}
          onClick={handleToggle}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className="hamburger-lines" />
        </button>

        {/* --- DESKTOP LAYOUT (Grid System) --- */}
        <div className="mini-desktop-nav" aria-hidden={open}>
          {/* 1. Left Spacer (for grid balance) */}
          <div className="desktop-spacer" />

          {/* 2. Center Links */}
          <ul className="desktop-links">
            {menuItems.map((item, index) => (
              <li
                key={index}
                tabIndex={0}
                className="mini-link-item"
                onClick={() => handleNavClick(item)}
              >
                {item}
              </li>
            ))}
          </ul>

          {/* 3. Right Icons */}
          <div className="desktop-icons">
            {/* Desktop Search Bar */}
            <div className={`search-wrapper ${searchOpen ? "active" : ""}`}>
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => !searchQuery && setSearchOpen(false)}
              />
              <button
                className="icon-btn"
                aria-label="Search"
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

        {/* --- MOBILE MENU OVERLAY --- */}
        {open && (
          <div id="mini-mobile-menu" ref={menuRef} className="mini-mobile-menu">
            {/* Mobile Search Bar (Only visible if toggled) */}
            {mobileSearchOpen ? (
              <div className="mobile-search-row">
                <Search size={18} className="mobile-search-icon-static" />
                <input
                  ref={mobileInputRef}
                  type="text"
                  placeholder="Search products..."
                  className="mobile-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="close-search-btn"
                  onClick={() => setMobileSearchOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              // If Search NOT open, show standard links
              <ul>
                {menuItems.map((item, i) => (
                  <li key={i} onClick={() => handleNavClick(item)}>
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {/* Mobile Bottom Icons */}
            <div className="mobile-icons">
              {/* Toggle Search View */}
              <button
                className={`icon-btn ${mobileSearchOpen ? "active-btn" : ""}`}
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              >
                <Search className="mini-icon" strokeWidth={1.3} />
              </button>

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
