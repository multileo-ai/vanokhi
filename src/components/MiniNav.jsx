import React, { useState, useRef, useEffect } from "react";
import "./MiniNav.css";
import { User, ShoppingCart, Search } from "lucide-react";

const MiniNav = () => {
  const menuItems = [
    "Collections",
    "All Products",
    "Raise Return & Exchange",
    "New Arrivals",
    "Most Wanted",
    "Our Story",
  ];

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // close when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return;
      const target = e.target;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !target.closest?.(".hamburger-btn")
      ) {
        setOpen(false);
      }
    };
    // attach in bubble phase so React's onClick runs first
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  return (
    <div className="mini-nav" role="navigation" aria-label="Mini">
      {/* hamburger visible only on small screens via CSS */}
      <button
        type="button"
        className="hamburger-btn"
        aria-expanded={open}
        aria-controls="mini-mobile-menu"
        onClick={(e) => {
          e.stopPropagation(); // avoid accidental document handlers
          setOpen((v) => !v);
        }}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <span className="hamburger-lines" />
      </button>

      {/* desktop inline links (hidden on small screens by CSS) */}
      <ul className="mini-links" aria-hidden={open}>
        {menuItems.map((item, index) => (
          <li key={index} tabIndex={0} className="mini-link-item">
            {item}
          </li>
        ))}

        <li className="mini-icons" aria-hidden="false" tabIndex={-1}>
          <button className="icon-btn" aria-label="Account">
            <User className="mini-icon" strokeWidth={1.3} />
          </button>
          <button className="icon-btn" aria-label="Search">
            <Search className="mini-icon" strokeWidth={1.3} />
          </button>
          <button className="icon-btn" aria-label="Cart">
            <ShoppingCart className="mini-icon" strokeWidth={1.3} />
          </button>
        </li>
      </ul>

      {/* mobile overlay/menu (only rendered when open) */}
      {open && (
        <div
          id="mini-mobile-menu"
          ref={menuRef}
          className="mini-mobile-menu"
          role="menu"
          aria-label="Mini mobile menu"
        >
          <ul>
            {menuItems.map((item, i) => (
              <li
                key={i}
                role="menuitem"
                tabIndex={0}
                onClick={() => setOpen(false)}
              >
                {item}
              </li>
            ))}
            <li className="mobile-icons">
              <button className="icon-btn" aria-label="Account">
                <User className="mini-icon" strokeWidth={1.3} />
              </button>
              <button className="icon-btn" aria-label="Search">
                <Search className="mini-icon" strokeWidth={1.3} />
              </button>
              <button className="icon-btn" aria-label="Cart">
                <ShoppingCart className="mini-icon" strokeWidth={1.3} />
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MiniNav;
