import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import "./BrandImage.css";
import Skeleton from "./common/Skeleton";

export default function BrandImage({ scrollToCategory }) {
  const [heroData, setHeroData] = useState({
    bannerUrl: "",
    tagline: "Loading our latest collection...",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reference to the 'hero' document in 'siteSettings' collection
    const heroDocRef = doc(db, "siteSettings", "hero");

    // Real-time listener: changes in Admin Panel reflect instantly here
    const unsubscribe = onSnapshot(
      heroDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setHeroData(docSnap.data());
        }
        setLoading(false);
      },
      (error) => {
        // Suppress or log error without crashing
        console.warn("BrandImage Hero Listener:", error.message);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading)
    return (
      <section className="brand-image-outer2" style={{ background: "#f0f0f0" }}>
        <div className="brand-image-viewport2">
          <Skeleton type="block" style={{ width: "100%", aspectRatio: "16/9", position: "absolute", top: 0, left: 0 }} />
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            width: "300px",
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <Skeleton type="text" style={{ width: "200px", height: "40px" }} />
          </div>
        </div>
      </section>
    );

  return (
    <section className="brand-image-outer2" aria-label="Brand image">
      <div
        className="brand-image-viewport2"
        role="img"
        aria-label="Vanokhi brand image"
      >
        <div className="hero-overlay2" />
        <div
          className="hero-center-badge2"
          aria-hidden
          onClick={scrollToCategory}
          style={{ cursor: "pointer" }}
        >
          <span className="badge-text2">"{heroData.tagline}"</span>
          {/* <span className="badge-text2"> “द वाह मोमेंट”</span> */}
        </div>
      </div>
    </section>
  );
}
