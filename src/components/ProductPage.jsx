// src/components/ProductPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ALL_PRODUCTS } from "../data";
import "./ProductPage.css";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToWishlist } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const found = ALL_PRODUCTS.find((p) => p.id === parseInt(id));
    if (found) setProduct(found);
    window.scrollTo(0, 0); // Reset scroll on entry
  }, [id]);

  if (!product)
    return <div className="vanokhi-loader">Restoring Elegance...</div>;

  return (
    <div className="vanokhi-pdp-container">
      {/* Back Button - Fixed Global */}
      <button className="pdp-fixed-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
      </button>

      <div className="pdp-layout-grid">
        {/* COLUMN 1 & 2: THE PINNED SECTION (LEFT & CENTER) */}
        <div className="pdp-pinned-content">
          <div className="pdp-sticky-wrapper">
            {/* Left: Vertical Sizes */}
            <div className="pdp-size-sidebar">
              <span className="sidebar-label">SELECT SIZE</span>
              <div className="size-vertical-list">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className={`v-size-btn ${
                      selectedSize === s ? "active" : ""
                    }`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Center: Main Info */}
            <div className="pdp-info-center">
              <div className="pdp-header-stack">
                <span className="pdp-brand">VANOKHI • EXCLUSIVE</span>
                <h1 className="pdp-title">{product.name}</h1>
                <p className="pdp-price">{product.price}</p>
              </div>

              {/* TABS (THE BLUE BOX UI) */}
              <div className="pdp-blue-tabs">
                <div className="tabs-nav">
                  <button
                    className={activeTab === "description" ? "active" : ""}
                    onClick={() => setActiveTab("description")}
                  >
                    Story
                  </button>
                  <button
                    className={activeTab === "details" ? "active" : ""}
                    onClick={() => setActiveTab("details")}
                  >
                    Details
                  </button>
                  <button
                    className={activeTab === "care" ? "active" : ""}
                    onClick={() => setActiveTab("care")}
                  >
                    Care
                  </button>
                </div>
                <div className="tabs-body">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="tab-content"
                    >
                      {activeTab === "description" && (
                        <p>{product.description}</p>
                      )}
                      {activeTab === "details" && (
                        <ul>
                          {product.details.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      )}
                      {activeTab === "care" && (
                        <p>Dry clean only. Premium silk care required.</p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="pdp-button-group">
                <button
                  className="pdp-btn-primary"
                  onClick={() => addToCart(product, product.colors[0])}
                >
                  <ShoppingBag size={18} /> ADD TO BAG
                </button>
                <button
                  className="pdp-btn-wish"
                  onClick={() => addToWishlist(product)}
                >
                  <Heart size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: THE SCROLLING SECTION (RIGHT) */}
        <div className="pdp-scroll-gallery">
          <div className="image-stack-scroll">
            {product.gallery?.map((img, i) => (
              <motion.div
                className="stack-item"
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <img src={img} alt={`Gallery view ${i}`} />
              </motion.div>
            ))}
          </div>
          {/* Buffer space at the bottom */}
          <div className="scroll-spacer"></div>
        </div>
      </div>
    </div>
  );
}
