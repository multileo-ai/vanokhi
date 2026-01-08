import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import real data
import "./MiniNav.css";
import { User, ShoppingCart, Search, X } from "lucide-react";
import CartSidebar from "./CartSidebar";
import ProfileSidebar from "./ProfileSidebar";

const MiniNav = () => {
  const { userData } = useAuth(); // Access global state
  const menuItems = [
    "Collections",
    "All Products",
    // "Return & Exchange",
    "New Arrivals",
    "Most Wanted",
    "Our Story",
  ];

  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const menuRef = useRef(null);
  const searchInputRef = useRef(null);

  // Sync real cart count
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

  // Reusable Icon Component to maintain UI consistency
  const ActionIcons = () => (
    <div className="nav-action-group">
      <div className={`search-wrapper ${searchOpen ? "active" : ""}`}>
        <input
          ref={searchInputRef}
          type="text"
          className="search-input"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="icon-btn" onClick={() => setSearchOpen(!searchOpen)}>
          <Search className="mini-icon" strokeWidth={1.3} />
        </button>
      </div>
      <button
        className="icon-btn"
        onClick={() => {
          setProfileOpen(true);
          setOpen(false);
        }}
      >
        <User className="mini-icon" strokeWidth={1.3} />
      </button>
      <button
        className="icon-btn"
        onClick={() => {
          setCartOpen(true);
          setOpen(false);
        }}
      >
        <div className="cart-badge-container">
          <ShoppingCart className="mini-icon" strokeWidth={1.3} />
          {cartItemCount > 0 && (
            <span className="cart-count">{cartItemCount}</span>
          )}
        </div>
      </button>
    </div>
  );

  // Helper function to handle routing logic
  const getPath = (item) => {
    if (item === "Collections") return "/collections";
    if (item === "All Products") return "/all-products";
    return "/";
  };

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
          {open ? <X color="#4a2b1f" /> : <span className="hamburger-lines" />}
        </button>

        {/* Desktop View */}
        <div className="mini-desktop-nav">
          <div className="desktop-spacer" />
          <ul className="desktop-links">
            {menuItems.map((item, index) => (
              <li key={index} className="mini-link-item">
                <Link
                  to={getPath(item)} // Use helper for correct pathing
                  className="nav-route-link"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
          <div className="desktop-icons">
            <ActionIcons />
          </div>
        </div>

        {/* Mobile Menu Content */}
        {open && (
          <div ref={menuRef} className="mini-mobile-menu">
            <ul>
              {menuItems.map((item, i) => (
                <li key={i}>
                  <Link
                    to={getPath(item)} // Use helper for correct pathing
                    className="mini-link-nav"
                    onClick={() => setOpen(false)}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Action icons placed in a single line inside the menu */}
            <div className="mobile-menu-icons">
              <ActionIcons />
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