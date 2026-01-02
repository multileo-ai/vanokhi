// src/components/CollectionPage.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowLeft, Heart } from "lucide-react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import { useAuth } from "../context/AuthContext";
import { ALL_PRODUCTS } from "../data"; // Import shared data
import "./CollectionPage.css";
import AverageRating from "./AverageRating";

const COLLECTIONS = [
  {
    id: "01",
    title: "VANOKHI ORIGINS",
    subtitle: "Classic Silhouettes",
    img: "/banner.png",
    productIds: [1, 2], // Reference product IDs from data.js
  },
  {
    id: "02",
    title: "VELVET NIGHTS",
    subtitle: "Evening Couture",
    img: "/brand-ad.jpg",
    productIds: [6, 8],
  },
];

const CollectionPage = () => {
  const [expanded, setExpanded] = useState(null);
  const { addToCart, addToWishlist } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="cp-viewport">
      {!expanded && (
        <button className="cp-back-home" onClick={() => navigate("/")}>
          <ArrowLeft size={24} /> <span>Home</span>
        </button>
      )}

      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.div key="list" className="cp-snap-container">
            {COLLECTIONS.map((col) => (
              <section
                key={col.id}
                className="cp-section"
                onClick={() => setExpanded(col)}
              >
                <div className="cp-bg-wrapper">
                  <img src={col.img} alt="" />
                </div>
                <div className="cp-content">
                  <span className="cp-number">{col.id}</span>
                  <h2>{col.title}</h2>
                  <p>{col.subtitle}</p>
                </div>
              </section>
            ))}
          </motion.div>
        ) : (
          <motion.div key="expanded" className="cp-expanded-view">
            <div className="cp-shrunk-header mobile-16-9">
              <div className="cp-shrunk-bg">
                <img src={expanded.img} alt="" />
              </div>
              <div className="cp-header-overlay">
                <h1>{expanded.title}</h1>
                <button className="cp-close" onClick={() => setExpanded(null)}>
                  <X size={32} />
                </button>
              </div>
            </div>

            <div className="cp-grid">
              {expanded.productIds.map((pid) => {
                const item = ALL_PRODUCTS.find((p) => p.id === pid);
                if (!item) return null;
                return (
                  <div key={item.id} className="cp-product-card">
                    <div className="cp-img-container">
                      {/* WRAPPING IMAGE IN LINK */}
                      <Link to={`/product/${item.id}`}>
                        <img src={item.img} alt={item.name} />
                      </Link>
                      <div className="cp-product-actions">
                        <button
                          className="action-btn wishlist"
                          onClick={() => addToWishlist(item)}
                        >
                          <Heart size={18} />
                        </button>
                        <button
                          className="action-btn cart"
                          onClick={() => addToCart(item, item.colors[0])}
                        >
                          <ShoppingBag size={18} /> Add to Bag
                        </button>
                      </div>
                    </div>
                    <div className="cp-product-info">
                      <Link
                        to={`/product/${item.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <h3>{item.name}</h3>
                      </Link>
                      <p className="cp-price">{item.price}</p>
                      {/* Add this line */}
                      <AverageRating productId={item.id} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollectionPage;
