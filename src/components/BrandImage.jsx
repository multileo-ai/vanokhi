import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import "./BrandImage.css";

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
        console.error("Error fetching hero data:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="hero-loader"></div>;
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
