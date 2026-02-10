// src/components/NewArivals.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import "./NewArivals.css";

export default function NewArivals() {
  const navigate = useNavigate();
  const [posterUrl, setPosterUrl] = useState("/newarivals.png");

  useEffect(() => {
    // UPDATED: Path changed to "sitesettings" to match your DB exactly
    const unsub = onSnapshot(doc(db, "sitesettings", "posters"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Check for the exact field name used in AdminPanel.jsx
        if (data.newArrivalsUrl) {
          setPosterUrl(data.newArrivalsUrl);
        }
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="brand-image-outer1">
      <div
        className="brand-image-viewport1"
        // FIXED: Added quotes around ${posterUrl} to handle paths with spaces
        style={{ backgroundImage: `url("${posterUrl}")` }}
      >
        <div className="hero-overlay1" />
        <div
          className="hero-center-badge1"
          onClick={() => navigate("/new-arrivals")}
        >
          <h2 className="badge-text1">New Arrivals</h2>
        </div>
      </div>
    </div>
  );
}
