import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import "./BrandStoryPage.css";

const BrandStoryPage = () => {
  const [images, setImages] = useState({
    img1: "/Rectangle 3.png", // Fallback to your original placeholder
    img2: "/image 2.png", // Fallback to your original placeholder
  });

  useEffect(() => {
    // Listen to the specific document in siteSettings
    const unsub = onSnapshot(
      doc(db, "siteSettings", "brandStory"),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setImages({
            img1: data.img1 || "/Rectangle 3.png",
            img2: data.img2 || "/image 2.png",
          });
        }
      },
    );
    return () => unsub();
  }, []);

  const loremIpsumText = `🌸 Vaanokhi - The Waah Moment

In a world obsessed with trends, Vaanokhi chooses to stand apart.
Born from the idea of “Vastra ka Anokhapan,” it celebrates the many cultures of India in a way that feels fresh, youthful, and unapologetically original.

Each collection reflects a new perspective — where Indian identity meets modern expression.
Vaanokhi is for those who don't follow trends, but set their own rhythm.

Because true style isn't copied, it's felt — in that one Waah Moment.`;

  return (
    <div className="brand-story-container">
      {/* Left Section: Red Background & Text */}
      <div className="text-content">
        <h1 className="brand-title">Brand Story</h1>
        <p className="brand-body-text">{loremIpsumText}</p>
      </div>

      {/* Right Section: Background Image */}
      <div className="right-image-container">
        <img
          src={images.img1}
          alt="Brand background"
          className="background-image"
        />
      </div>

      {/* The Overlapping Foreground Image */}
      <div className="overlap-image-container">
        <img
          src={images.img2}
          alt="Brand overlap"
          className="foreground-image"
        />
      </div>
    </div>
  );
};

export default BrandStoryPage;
