// src/components/NewArivals.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import "./NewArivals.css";

export default function NewArivals() {
  const [posterUrl, setPosterUrl] = useState("/newarivals.png"); // Default image

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "siteSettings", "posters"), (docSnap) => {
      if (docSnap.exists() && docSnap.data().newArrivalsUrl) {
        setPosterUrl(docSnap.data().newArrivalsUrl);
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="brand-image-outer1">
      {/* Inline style overrides the hardcoded CSS image */}
      <div
        className="brand-image-viewport1"
        style={{ backgroundImage: `url(${posterUrl})` }}
      >
        <div className="hero-overlay1" />
        <div className="hero-center-badge1">
          <h2 className="badge-text1">New Arrivals</h2>
        </div>
      </div>
    </div>
  );
}
