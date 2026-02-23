/* src/components/ContactUs.jsx */
import React, { useState } from "react";
import { db } from "../firebase"; //
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; //
import { toast } from "react-hot-toast"; //
import { motion, useScroll, useTransform } from "framer-motion";
import "./ContactUs.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { scrollYProgress } = useScroll();

  // Infinite Parallax Text Effect
  const xTranslate = useTransform(scrollYProgress, [0, 1], [0, -500]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "contactSubmissions"), {
        ...formData,
        timestamp: serverTimestamp(),
      });
      toast.success("Message gracefully received.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-luxury-wrapper">
      {/* Background Infinite Text */}
      <div className="infinite-text-container">
        <motion.h2 style={{ x: xTranslate }} className="parallax-bg-text">
          VANOKHI • द वाह मोमेंट • LUXURY • VANOKHI • द वाह मोमेंट • LUXURY
        </motion.h2>
      </div>

      <div className="contact-main-grid">
        {/* Left Section: Aesthetic Information */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="contact-info-panel"
        >
          <span className="section-tag">CONNECT</span>
          <h1 className="contact-hero-title">
            Let's craft <br />
            your story.
          </h1>

          <div className="floating-contact-details">
            <div className="detail-item">
              <h4>INQUIRIES</h4>
              <p>vanokhi.co@gmail.com</p>
            </div>
            <div className="detail-item">
              <h4>LOCATION</h4>
              <p>Kharadi Bypass, Pune</p>
            </div>
            <div className="detail-item">
              <h4>INSTAGRAM</h4>
              <p>@vanokhi.in</p>
            </div>
          </div>
        </motion.section>

        {/* Right Section: Interactive Form */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="contact-form-panel"
        >
          <form onSubmit={handleSubmit} className="modern-editorial-form">
            <div className="input-field-wrapper">
              <label>WHO ARE YOU?</label>
              <input
                type="text"
                placeholder="YOUR FULL NAME"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="input-field-wrapper">
              <label>WHERE CAN WE REACH YOU?</label>
              <input
                type="email"
                placeholder="YOUR EMAIL ADDRESS"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="input-field-wrapper">
              <label>WHAT'S ON YOUR MIND?</label>
              <textarea
                placeholder="TELL US EVERYTHING..."
                rows="5"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
              ></textarea>
            </div>

            <motion.button
              type="submit"
              className="magnetic-submit-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting}
            >
              <span className="btn-text">
                {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
              </span>
              <div className="btn-fill"></div>
            </motion.button>
          </form>
        </motion.section>
      </div>
    </div>
  );
};

export default ContactUs;
