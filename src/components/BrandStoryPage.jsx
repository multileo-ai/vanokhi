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

  const loremIpsumText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. 

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?`;

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
