import React from "react";
import "./TestimonialsGrid.css";

export default function TestimonialsGrid() {
  const testimonials = [
    {
      name: "Samantha Jones",
      role: "Lifestyle Blogger",
      img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?fit=crop&w=500&h=500",
      review:
        "Absolutely loved this experience! The design and flow feel premium and smooth. Highly recommended!",
    },
    {
      name: "Ryan Adams",
      role: "Entrepreneur",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=500&h=500",
      review:
        "The interface is super intuitive. Everything feels modern and thoughtfully built.",
    },
    {
      name: "Isabella Garcia",
      role: "Travel Influencer",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=500&h=500",
      review:
        "Gorgeous UI! Smooth animations and perfect responsiveness. Works beautifully on mobile.",
    },
    {
      name: "Michael Carter",
      role: "Designer",
      img: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?fit=crop&w=500&h=500",
      review:
        "This is one of the cleanest and most attractive testimonial designs I've ever seen.",
    },
  ];

  return (
    <section className="testimonials-section">
      <h2 className="testimonials-heading">What People Say ❤️</h2>

      <div className="testimonials-wrapper">
        <div className="testimonials-track">
          {testimonials.concat(testimonials).map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div className="t-img-box">
                <img src={t.img} alt={t.name} />
              </div>

              <p className="t-review">“{t.review}”</p>

              <p className="t-name">{t.name}</p>
              <p className="t-role">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
