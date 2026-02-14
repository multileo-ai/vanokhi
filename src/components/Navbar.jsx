import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

// Props are now Elements (or null), not Refs
export default function Navbar({
  whiteSectionEl,
  hideSectionEl,
  newArrivalsEl,
}) {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  const [isWhite, setIsWhite] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isRed, setIsRed] = useState(false);

  useEffect(() => {
    // Only run this logic on the landing page
    if (!isLandingPage) {
      setIsWhite(false);
      setIsHidden(false);
      setIsRed(false);
      return;
    }

    const options = {
      root: null,
      threshold: 0,
      rootMargin: "-80px 0px 0px 0px", // Offset for navbar height
    };

    // 1. Observer for WHITE section
    const whiteObserver = new IntersectionObserver(([entry]) => {
      // If the white section is intersecting with the top area
      setIsWhite(entry.isIntersecting);
    }, options);

    if (whiteSectionEl) {
      whiteObserver.observe(whiteSectionEl);
    }

    // 2. Observer for HIDING navbar (New Arrivals & Instagram)
    const hideObserver = new IntersectionObserver(
      ([entry]) => {
        setIsHidden(entry.isIntersecting);
      },
      { ...options, threshold: 0 }
    );

    if (hideSectionEl) {
      hideObserver.observe(hideSectionEl);
    }

    // 3. Observer for RED text (Brand Title)
    // We need to find the element dynamically as refs might not be forwarded deep enough
    const brandTitleElement = document.querySelector(".brand-title");
    const redObserver = new IntersectionObserver(
      ([entry]) => {
        setIsRed(entry.isIntersecting);
      },
      { rootMargin: "-160px 0px 0px 0px" }
    );

    if (brandTitleElement) {
      redObserver.observe(brandTitleElement);
    }

    return () => {
      whiteObserver.disconnect();
      hideObserver.disconnect();
      redObserver.disconnect();
    };
  }, [isLandingPage, whiteSectionEl, hideSectionEl, newArrivalsEl]);

  return (
    <nav
      className={`vanokhi-navbar ${isWhite ? "nav-white" : ""} ${isRed ? "nav-red" : ""
        } ${isHidden ? "nav-hidden" : ""} ${isLandingPage ? "landing-nav" : "other-nav"
        }`}
      role="navigation"
      aria-label="Main"
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          textDecoration: "none",
        }}
      >
        {/* Wrapped Logo in a Link to enable navigation back to Home */}
        <Link to="/" className="nav-logo-link">
          <h1 className="nav-logo" tabIndex={0}>
            Vanokhi
          </h1>
        </Link>
      </div>
    </nav>
  );
}
