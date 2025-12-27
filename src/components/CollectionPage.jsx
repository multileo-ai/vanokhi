import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ShoppingBag } from "lucide-react";
import "./CollectionPage.css";

const COLLECTIONS = [
  {
    id: "01",
    name: "Ethereal Silk",
    tagline: "The Poetry of Motion",
    image: "/banner.png",
    accent: "#f5f5f5",
    products: [
      { id: 1, name: "Ivory Wrap Dress", price: "₹8,900", img: "/trail-images/01.jpg" },
      { id: 2, name: "Midnight Slip", price: "₹6,400", img: "/trail-images/02.jpg" },
      { id: 3, name: "Petal Gown", price: "₹12,500", img: "/trail-images/03.jpg" },
      { id: 4, name: "Aura Set", price: "₹9,200", img: "/trail-images/04.jpg" },
    ],
  },
  {
    id: "02",
    name: "Modern Heritage",
    tagline: "Classic Craft, Modern Soul",
    image: "/brand-ad.jpg",
    accent: "#e8e8e8",
    products: [
      { id: 5, name: "Heritage Blazer", price: "₹15,000", img: "/trail-images/05.jpg" },
      { id: 6, name: "Veda Trousers", price: "₹7,800", img: "/trail-images/06.jpg" },
      { id: 7, name: "Sculpt Top", price: "₹4,500", img: "/trail-images/07.jpg" },
    ],
  },
];

const CollectionPage = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="collection-main">
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div 
            key="list" 
            className="vertical-banner-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {COLLECTIONS.map((col) => (
              <motion.section 
                key={col.id} 
                className="collection-section"
                layoutId={`container-${col.id}`}
                onClick={() => setSelected(col)}
              >
                <motion.div className="banner-visual">
                  <motion.img 
                    layoutId={`img-${col.id}`} 
                    src={col.image} 
                    alt={col.name} 
                  />
                  <div className="banner-overlay-soft" />
                </motion.div>
                
                <motion.div className="banner-content" layoutId={`content-${col.id}`}>
                  <span className="col-number">{col.id}</span>
                  <h2 className="col-title">{col.name}</h2>
                  <p className="col-tagline">{col.tagline}</p>
                  <motion.div className="explore-btn">
                    EXPLORE <ArrowRight size={18} />
                  </motion.div>
                </motion.div>
              </motion.section>
            ))}
          </motion.div>
        ) : (
          <motion.div key="detail" className="detail-canvas">
            {/* Header / Shrunk Banner */}
            <motion.div 
              className="detail-header" 
              layoutId={`container-${selected.id}`}
            >
              <motion.img 
                layoutId={`img-${selected.id}`} 
                src={selected.image} 
                className="header-bg"
              />
              <motion.div className="header-text-box" layoutId={`content-${selected.id}`}>
                <h1>{selected.name}</h1>
                <button className="close-canvas" onClick={() => setSelected(null)}>
                   <X size={30} />
                </button>
              </motion.div>
            </motion.div>

            {/* Product Reveal */}
            <motion.div 
              className="reveal-grid-container"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "circOut" }}
            >
              <div className="reveal-grid">
                {selected.products.map((p) => (
                  <motion.div key={p.id} className="modern-product-card" whileHover={{ y: -10 }}>
                    <div className="product-visual">
                      <img src={p.img} alt={p.name} />
                      <div className="quick-add"><ShoppingBag size={20} /></div>
                    </div>
                    <div className="product-meta">
                      <h3>{p.name}</h3>
                      <p>{p.price}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollectionPage;