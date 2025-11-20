import { useState, useEffect } from "react";
// import "./HeroCarousel.css";

function HeroCarousel() {
  const slides = [
    {
      image:
        "https://static.vecteezy.com/system/resources/previews/043/339/960/non_2x/3d-autumn-women-clothing-collection-ads-banner-concept-poster-card-vector.jpg",
    },
    {
      image: "https://img.pikbest.com/origin/09/30/65/27hpIkbEsTzdI.jpg!sw800",
    },
    {
      image:
        "https://static.vecteezy.com/system/resources/previews/043/340/156/non_2x/3d-winter-seasonal-clothing-collection-ads-banner-concept-poster-card-vector.jpg",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleClick = () => {
    alert("Redirecting to page...");
  };

  return (
    <>
      <div className="lux-carousel">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`lux-slide ${index === current ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
            onClick={handleClick}
          />
        ))}

        <div className="lux-dots">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={current === idx ? "dot active" : "dot"}
              onClick={() => setCurrent(idx)}
            />
          ))}
        </div>
      </div>

      
    </>
  );
}

export default HeroCarousel;
