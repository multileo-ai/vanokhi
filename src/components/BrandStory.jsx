/* src/components/BrandStory.jsx */
import React, { useState } from "react";
import { TypeAnimation } from "react-type-animation";
import "./BrandStory.css";

export default function BrandStory() {
  const [resetKey, setResetKey] = useState(0);

  return (
    <section id="brand-story" className="brand-story-box" aria-live="polite">
      <div className="brand-story-inner">
        <div className="typing-container">
          <TypeAnimation
            key={resetKey} // Forces component to re-render from scratch when key changes
            sequence={[
              "Distinct in identity",
              800,
              "Distinct in identity, rooted in culture reimagined",
              800,
              "Distinct in identity, rooted in culture reimagined — that's Vaanokhi.",
              800,
              () => setResetKey((prev) => prev + 1), // At the very end, change the key to reset
            ]}
            wrapper="span"
            speed={50}
            cursor={true}
            repeat={0} // We handle the "repeat" manually via the key for a clean reset
          />
        </div>
      </div>
    </section>
  );
}
