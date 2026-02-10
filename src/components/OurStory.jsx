import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Ensure this path is correct
import { doc, onSnapshot } from "firebase/firestore";
import "./OurStory.css";

export default function OurStory() {
  const [bannerUrl, setBannerUrl] = useState("");

  useEffect(() => {
    const heroDocRef = doc(db, "siteSettings", "hero");
    const unsubscribe = onSnapshot(heroDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.bannerUrl) {
          setBannerUrl(data.bannerUrl);
        }
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <div className="story-page-wrapper">
      {/* 1st: Big Banner + Text */}
      <section className="story-row">
        <div className="full-banner">
          <img src={bannerUrl || "/banner.png"} alt="Vanokhi Banner" />
        </div>
        <div className="story-text-block">
          <h1 className="story-title">OUR STORY & PHILOSOPHY</h1>
          <p>
            Vaanokhi - The Waah Moment In a world obsessed with trends,
            Vaanokhi chooses to stand apart. Born from the idea of “Vastra ka
            Anokhapan,” it celebrates the many cultures of India in a way that
            feels fresh, youthful, and unapologetically original. Each
            collection reflects a new perspective — where Indian identity meets
            modern expression. Vaanokhi is for those who don't follow trends,
            but set their own rhythm. Because true style isn't copied, it's felt
            — in that one Waah Moment.
          </p>
        </div>
      </section>

      {/* 2nd: Two 50% Banners + Text */}
      <section className="story-row">
        <div className="split-grid-50">
          <img src="/roots/root1.jpg" alt="Modern" />
          <img src="/roots/root2.jpg" alt="Heritage" />
        </div>
        <div className="story-text-block">
          <h2 className="story-title">Culture Reimagined</h2>
          <p>
            Each collection draws inspiration from India’s diverse cultures,
            reinterpreted in a way that speaks to today’s generation — bold,
            curious, and creative.
          </p>
        </div>
      </section>

      {/* 3rd: Big Banner + Text */}
      <section className="story-row">
        <div className="full-banner">
          <img src="/roots/root3.jpg" alt="Philosophy Banner" />
        </div>
        <div className="story-text-block">
          <h2 className="story-title">Distinct Identity</h2>
          <p>
            Vaanokhi stands apart from fast fashion by creating original,
            seasonless designs that reflect individuality rather than trends.
          </p>
        </div>
      </section>

      {/* 4th: 30% - 70% Banners + Final Text */}
      <section className="story-row">
        <div className="split-grid-30-70">
          <div className="small-cap">
            <img src="/brand-ad.jpg" alt="Detail" />
          </div>
          <div className="large-cap">
            <img src="/newarivals.png" alt="Vision" />
          </div>
        </div>
        <div className="story-text-block final-block">
          <p className="final-text">— “ द वाह मोमेंट ” —</p>
          <p className="sub-final">Vanokhi | Crafted with Passion</p>
        </div>
      </section>
    </div>
  );
}
