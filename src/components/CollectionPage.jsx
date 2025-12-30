import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, MoveDown, ArrowLeft, Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./CollectionPage.css";

const COLLECTIONS = [
  {
    id: "01",
    title: "VANOKHI ORIGINS",
    subtitle: "Classic Silhouettes",
    img: "/banner.png",
    items: [
      { id: 1, name: "Ivory Silk Gown", price: "₹12,000", img: "/trail-images/01.jpg", rating: 4.8, colors: ["#F5F5DC", "#FFFFFF"] },
      { id: 2, name: "Classic Wrap", price: "₹8,500", img: "/trail-images/02.jpg", rating: 4.5, colors: ["#000000", "#4A0E0E"] },
      { id: 3, name: "Ethereal Veil", price: "₹4,200", img: "/trail-images/03.jpg", rating: 4.9, colors: ["#FFFFFF"] },
      { id: 4, name: "Gardenia Dress", price: "₹9,800", img: "/trail-images/04.jpg", rating: 4.7, colors: ["#FFF5EE"] },
      { id: 5, name: "Petal Maxi", price: "₹11,200", img: "/trail-images/05.jpg", rating: 4.6, colors: ["#FFC0CB"] },
    ],
  },
  {
    id: "02",
    title: "VELVET NIGHTS",
    subtitle: "Evening Couture",
    img: "/brand-ad.jpg",
    items: [
      { id: 6, name: "Midnight Blazer", price: "₹15,000", img: "/trail-images/06.jpg", rating: 5.0, colors: ["#191970", "#000000"] },
      { id: 7, name: "Noir Slit Dress", price: "₹11,000", img: "/trail-images/07.jpg", rating: 4.8, colors: ["#000000"] },
      { id: 8, name: "Crimson Gown", price: "₹18,500", img: "/trail-images/08.jpg", rating: 4.9, colors: ["#8B0000"] },
      { id: 9, name: "Velvet Bodysuit", price: "₹5,600", img: "/trail-images/09.jpg", rating: 4.4, colors: ["#4B0082"] },
      { id: 10, name: "Onyx Cape", price: "₹7,200", img: "/trail-images/10.jpg", rating: 4.7, colors: ["#000000"] },
    ],
  },
];

const CollectionPage = () => {
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="cp-viewport">
      {!expanded && (
        <button className="cp-back-home" onClick={() => navigate("/")}>
          <ArrowLeft size={24} />
          <span>Home</span>
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
            {COLLECTIONS.map((col, index) => (
              <section key={col.id} className="cp-section" onClick={() => setExpanded(col)}>
                <motion.div layoutId={`bg-${col.id}`} className="cp-bg-wrapper">
                  <img src={col.img} alt="" />
                </motion.div>
                <div className="cp-content">
                  <motion.span layoutId={`num-${col.id}`} className="cp-number">{col.id}</motion.span>
                  <motion.h2 layoutId={`title-${col.id}`}>{col.title}</motion.h2>
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
            <div className="cp-shrunk-header mobile-16-9">
              <motion.div layoutId={`bg-${expanded.id}`} className="cp-shrunk-bg">
                <img src={expanded.img} alt="" />
              </motion.div>
              <div className="cp-header-overlay">
                <motion.h1 layoutId={`title-${expanded.id}`}>{expanded.title}</motion.h1>
                <button className="cp-close" onClick={() => setExpanded(null)}>
                  <X size={32} />
                </button>
              </div>
            </div>

            <motion.div
              className="cp-grid"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {expanded.items.map((item, idx) => (
                <motion.div key={item.id} className="cp-product-card">
                  <div className="cp-img-container">
                    <img src={item.img} alt={item.name} />
                    <div className="cp-product-actions">
                      <button className="action-btn wishlist"><Heart size={18} /></button>
                      <button className="action-btn cart"><ShoppingBag size={18} /> Add to Cart</button>
                    </div>
                    <div className="cp-rating-tag"><Star size={12} fill="currentColor" /> {item.rating}</div>
                  </div>
                  <div className="cp-product-info">
                    <div className="cp-info-header">
                      <h3>{item.name}</h3>
                      <p className="cp-price">{item.price}</p>
                    </div>
                    <div className="cp-color-swatches">
                      {item.colors?.map((c, i) => (<span key={i} className="swatch" style={{ backgroundColor: c }} />))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollectionPage;