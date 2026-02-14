// src/components/CollectionPage.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowLeft, Heart, Star } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./CollectionPage.css";
import AverageRating from "./AverageRating";
import Skeleton from "./common/Skeleton";

const CollectionPage = () => {
  const [expanded, setExpanded] = useState(null);
  const { addToCart, addToWishlist, userData, liveCollections, liveProducts, loading } =
    useAuth();
  const navigate = useNavigate();

  return (
    <div className="cp-viewport">
      {/* 1. Fixed Back Button (Banner View Only) */}
      {!expanded && (
        <button className="cp-back-home" onClick={() => navigate("/")}>
          <ArrowLeft size={24} />
        </button>
      )}

      {/* 2. Main Vertical Snap Scroll Container */}
      <div className="cp-snap-container">
        {loading
          ? [...Array(3)].map((_, i) => (
            <div key={i} className="cp-section">
              <Skeleton
                type="block"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          ))
          : liveCollections.map((col) => (
            <div
              key={col.id}
              className="cp-section"
              onClick={() => setExpanded(col)}
            >
              <div className="cp-bg-wrapper">
                <img src={col.img} alt={col.title} />
              </div>
              <div className="cp-content">
                <motion.h2
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                >
                  {col.title}
                </motion.h2>
                <p
                  style={{
                    fontSize: "0.8rem",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    fontStyle: "normal",
                    marginTop: "20px",
                  }}
                >
                  Explore Collection
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* 3. Expanded Overlay Animation */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="cp-expanded-view"
          >
            {/* Shrunk Header Design */}
            <div className="cp-shrunk-header mobile-16-9">
              <div className="cp-shrunk-bg">
                <img src={expanded.img} alt={expanded.title} />
              </div>
              <div className="cp-header-overlay">
                <h1>{expanded.title}</h1>
              </div>
              <button className="cp-close" onClick={() => setExpanded(null)}>
                <X size={32} />
              </button>
            </div>

            {/* Dynamic Product Grid */}
            <div className="cp-grid">
              {expanded.productIds?.map((pid) => {
                const item = liveProducts.find((p) => p.id === pid);
                if (!item) return null;

                const isOutOfStock = item.stock === 0;

                const isInWishlist = userData?.wishlist?.some(
                  (w) => w.id === item.id,
                );

                return (
                  <div
                    key={item.id}
                    className={`cp-product-card ${isOutOfStock ? "out-of-stock" : ""
                      }`}
                  >
                    <div className="cp-img-container">
                      <Link to={`/product/${item.id}`}>
                        <img
                          src={item.img}
                          alt={item.name}
                          loading="lazy" // Adds native lazy loading
                          decoding="async" // Helps prevent animation lag during decode
                        />
                      </Link>

                      {/* <div className="cp-rating-tag">
                        <Star size={12} fill="#860204" color="#860204" />
                      </div> */}
                      <AverageRating productId={item.id} />

                      <div className="cp-product-actions">
                        <button
                          className={`action-btn wishlist ${isInWishlist ? "active" : ""
                            }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToWishlist(item);
                          }}
                        >
                          <Heart
                            size={18}
                            fill={isInWishlist ? "#860204" : "none"}
                            color={isInWishlist ? "#860204" : "currentColor"}
                          />
                        </button>
                        <button
                          className="action-btn cart"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(
                              item,
                              "M",
                              item.colors ? item.colors[0] : null,
                            );
                          }}
                        >
                          <ShoppingBag size={18} /> Add to Bag
                        </button>
                      </div>
                    </div>

                    <div className="cp-product-info">
                      <div className="cp-info-header">
                        <h3 className="global-product-name">{item.name}</h3>
                      </div>
                      <div className="global-price-row">
                        <span className="global-product-price">{item.price}</span>
                        {item.originalPrice && (
                          <span className="global-product-price-original">
                            {item.originalPrice}
                          </span>
                        )}
                      </div>
                      {/* <AverageRating productId={item.id} /> */}
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
