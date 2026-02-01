import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import "./FaqModal.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Link } from "react-router-dom";

const FAQ_DATA = [
  {
    question: "How do I track my order?",
    answer:
      "Once your order is shipped, you will receive an email with a tracking number and a link to track your package in real-time.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 7-day return policy for unused items with original tags intact. Please visit our 'Return and Exchange' section for more details.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Currently, we focus on domestic shipping within India, providing the best service and speed to our local customers.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach us via email at support@nishorama.com or DM us on Instagram @vanokhi_official. Our team is active Mon-Sat.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once your order is shipped, you will receive an email with a tracking number and a link to track your package in real-time.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 7-day return policy for unused items with original tags intact. Please visit our 'Return and Exchange' section for more details.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Currently, we focus on domestic shipping within India, providing the best service and speed to our local customers.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach us via email at support@nishorama.com or DM us on Instagram @vanokhi_official. Our team is active Mon-Sat.",
  },
];

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className={`faq-accordion-item ${isOpen ? "active" : ""}`}>
      <button className="faq-question-btn" onClick={onClick}>
        <span>{question}</span>
        <ChevronDown
          className={`faq-icon ${isOpen ? "rotate" : ""}`}
          size={20}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="faq-answer-wrapper"
          >
            <div className="faq-answer-content">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FAQModal({ isOpen, onClose }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="faq-overlay" onClick={onClose}>
          <motion.div
            className="faq-modal"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="faq-modal-header">
              <div className="header-title">
                <span className="subtitle">Got Questions?</span>
                <h2>Frequently Asked</h2>
              </div>
              <button className="faq-close-btn" onClick={onClose}>
                <X size={28} />
              </button>
            </div>

            <div className="faq-modal-body">
              {FAQ_DATA.map((item, index) => (
                <FAQItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openIndex === index}
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                />
              ))}
            </div>

            <div className="faq-modal-footer">
              <p>
                Still need help?{" "}
                <span>
                  <Link
                    to="/contact"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Contact Support
                  </Link>
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
