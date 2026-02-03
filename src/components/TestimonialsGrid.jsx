import React from "react";
import "./TestimonialsGrid.css";

export default function TestimonialsGrid() {
  const testimonials = [
    {
      id: 1,
      name: "Sanjana Kulkarni",
      role: "Verified Buyer, Pune",
      content:
        "The quality of the fabric is actually better than what I expected for the price. It's so hard to find authentic designs that don't feel like cheap polyester. Truly impressed.",
      avatar: "S",
    },
    {
      id: 2,
      name: "Rajesh Sharma",
      role: "Gifted to Wife",
      content:
        "I was worried about the delivery time for my anniversary, but it reached Delhi in 4 days. The packaging was very premium. My wife loved the 'Gajara' collection.",
      avatar: "R",
    },
    {
      id: 3,
      name: "Anjali Deshmukh",
      role: "College Student",
      content:
        "As a student, I look for pieces I can style in multiple ways. These tops are perfect for both campus and family functions. Very versatile!",
      avatar: "A",
    },
    {
      id: 4,
      name: "Meera Iyer",
      role: "Verified Buyer, Bangalore",
      content:
        "Finally a brand that understands the middle-class need for elegance without overcharging. The fitting is spot on, especially around the shoulders.",
      avatar: "M",
    },
    {
      id: 5,
      name: "Pooja Verma",
      role: "Working Professional",
      content:
        "Bought two sarees for my sister's wedding. The colors are exactly as shown in the pictures—no filters or fake lighting. Will definitely buy again.",
      avatar: "P",
    },
    {
      id: 6,
      name: "Vikram Gaikwad",
      role: "Bought for Mother",
      content:
        "Mom is very picky about cotton quality, but she was very happy with the Vanokhi suit. It's soft and the print is very traditional yet modern.",
      avatar: "V",
    },
    {
      id: 7,
      name: "Sneha Patil",
      role: "Verified Buyer, Nashik",
      content:
        "The customer support team helped me change my size after I placed the order. Very polite and helpful people. Great service!",
      avatar: "S",
    },
    {
      id: 8,
      name: "Komal Gupta",
      role: "Verified Buyer, Indore",
      content:
        "I love the 'Vanokhi' aesthetic. It feels very personal, like something designed specifically for the modern Indian woman. Highly recommended.",
      avatar: "K",
    },
  ];

  return (
    <section className="testimonials-section">
      <h2 className="testimonials-heading">What People Say</h2>

      <div className="testimonials-wrapper">
        <div className="testimonials-track">
          {testimonials.concat(testimonials).map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div
                className="t-img-box"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#860204", // Brand Red
                  color: "#fff",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  borderRadius: "50%",
                  fontFamily: "myMontserrat",
                }}
              >
                {/* Replaced img with the avatar letter */}
                <span>{t.avatar}</span>
              </div>

              <p className="t-review">“{t.content}”</p>

              <p className="t-name">{t.name}</p>
              <p className="t-role">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
