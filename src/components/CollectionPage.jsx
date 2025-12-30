// src/components/CollectionPage.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowLeft, Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./CollectionPage.css";

const COLLECTIONS = [
  {
    id: "01",
    title: "VANOKHI ORIGINS",
    subtitle: "Classic Silhouettes",
    img: "/banner.png",
    items: [
      {
        id: 1,
        name: "Ivory Silk Gown",
        price: "₹12,000",
        img: "/trail-images/01.jpg",
        rating: 4.8,
        colors: ["#F5F5DC", "#FFFFFF"],
      },
      {
        id: 2,
        name: "Classic Wrap",
        price: "₹8,500",
        img: "/trail-images/02.jpg",
        rating: 4.5,
        colors: ["#000000", "#4A0E0E"],
      },
      {
        id: 3,
        name: "Ethereal Veil",
        price: "₹4,200",
        img: "/trail-images/03.jpg",
        rating: 4.9,
        colors: ["#FFFFFF"],
      },
    ],
  },
  {
    id: "02",
    title: "VELVET NIGHTS",
    subtitle: "Evening Couture",
    img: "/brand-ad.jpg",
    items: [
      {
        id: 6,
        name: "Midnight Blazer",
        price: "₹15,000",
        img: "/trail-images/06.jpg",
        rating: 5.0,
        colors: ["#191970", "#000000"],
      },
      {
        id: 8,
        name: "Crimson Gown",
        price: "₹18,500",
        img: "/trail-images/08.jpg",
        rating: 4.9,
        colors: ["#8B0000"],
      },
    ],
  },
];

const CollectionPage = () => {
  const [expanded, setExpanded] = useState(null);
  const [selectedColors, setSelectedColors] = useState({}); // Track selection per item
  const { addToCart, addToWishlist } = useAuth();
  const navigate = useNavigate();

  const handleColorSelect = (itemId, color) => {
    setSelectedColors((prev) => ({ ...prev, [itemId]: color }));
  };

  return (
    <div className="cp-viewport">
      {!expanded && (
        <button className="cp-back-home" onClick={() => navigate("/")}>
          <ArrowLeft size={24} /> <span>Home</span>
        </button>
      )}

      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.div
            key="list"
            className="cp-snap-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {COLLECTIONS.map((col) => (
              <section
                key={col.id}
                className="cp-section"
                onClick={() => setExpanded(col)}
              >
                <motion.div layoutId={`bg-${col.id}`} className="cp-bg-wrapper">
                  <img src={col.img} alt="" />
                </motion.div>
                <div className="cp-content">
                  <motion.span layoutId={`num-${col.id}`} className="cp-number">
                    {col.id}
                  </motion.span>
                  <motion.h2 layoutId={`title-${col.id}`}>
                    {col.title}
                  </motion.h2>
                  <motion.p layoutId={`sub-${col.id}`}>{col.subtitle}</motion.p>
                </div>
              </section>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            className="cp-expanded-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="cp-shrunk-header">
              <motion.div
                layoutId={`bg-${expanded.id}`}
                className="cp-shrunk-bg"
              >
                <img src={expanded.img} alt="" />
              </motion.div>
              <div className="cp-header-overlay">
                <motion.h1 layoutId={`title-${expanded.id}`}>
                  {expanded.title}
                </motion.h1>
                <button className="cp-close" onClick={() => setExpanded(null)}>
                  <X size={32} />
                </button>
              </div>
            </div>

            <motion.div
              className="cp-grid"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              {expanded.items.map((item) => (
                <div key={item.id} className="cp-product-card">
                  <div className="cp-img-container">
                    <img src={item.img} alt={item.name} />
                    <div className="cp-product-actions">
                      <button
                        className="action-btn wishlist"
                        onClick={() => addToWishlist(item)}
                      >
                        <Heart size={18} />
                      </button>
                      <button
                        className="action-btn cart"
                        onClick={() =>
                          addToCart(
                            item,
                            selectedColors[item.id] || item.colors[0]
                          )
                        }
                      >
                        <ShoppingBag size={18} /> Add to Bag
                      </button>
                    </div>
                  </div>
                  <div className="cp-product-info">
                    <div className="cp-info-header">
                      <h3>{item.name}</h3>
                      <p className="cp-price">{item.price}</p>
                    </div>
                    <div className="cp-color-swatches">
                      {item.colors?.map((c, i) => (
                        <span
                          key={i}
                          className={`swatch ${
                            selectedColors[item.id] === c ? "active" : ""
                          }`}
                          style={{ backgroundColor: c }}
                          onClick={() => handleColorSelect(item.id, c)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollectionPage;
