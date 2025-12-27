import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, MoveDown } from "lucide-react";
import { Link } from "react-router-dom";
import "./CollectionPage.css";
import Navbar from "./Navbar";

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
      },
      {
        id: 2,
        name: "Classic Wrap",
        price: "₹8,500",
        img: "/trail-images/02.jpg",
      },
      {
        id: 3,
        name: "Ethereal Veil",
        price: "₹4,200",
        img: "/trail-images/03.jpg",
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
        id: 4,
        name: "Midnight Blazer",
        price: "₹15,000",
        img: "/trail-images/04.jpg",
      },
      {
        id: 5,
        name: "Noir Slit Dress",
        price: "₹11,000",
        img: "/trail-images/05.jpg",
      },
    ],
  },
];

const CollectionPage = () => {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="cp-viewport">
      {/* Branding fix: Show logo even on this page */}
      <Navbar isWhite={false} isHidden={false} />

      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.div
            className="cp-snap-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {COLLECTIONS.map((col, index) => (
              <section
                key={col.id}
                className="cp-section"
                onClick={() => setExpanded(col)}
              >
                <motion.div
                  className="cp-bg-wrapper"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <img src={col.img} alt="" />
                </motion.div>

                <div className="cp-content">
                  <motion.span
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    className="cp-number"
                  >
                    {col.id}
                  </motion.span>
                  <motion.h2
                    initial={{ clipPath: "inset(100% 0 0 0)" }}
                    whileInView={{ clipPath: "inset(0% 0 0 0)" }}
                    transition={{ duration: 1, delay: 0.2 }}
                  >
                    {col.title}
                  </motion.h2>
                  <p>{col.subtitle}</p>
                </div>

                {index === 0 && (
                  <div className="cp-scroll-hint">
                    <p>Scroll</p>
                    <MoveDown size={20} />
                  </div>
                )}
              </section>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="cp-expanded-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Shrinking Banner */}
            <motion.div
              layoutId={`banner-${expanded.id}`}
              className="cp-shrunk-header"
            >
              <img src={expanded.img} alt="" />
              <div className="cp-header-overlay">
                <h1>{expanded.title}</h1>
                <button className="cp-close" onClick={() => setExpanded(null)}>
                  <X size={30} />
                </button>
              </div>
            </motion.div>

            {/* Product Grid Reveal */}
            <motion.div
              className="cp-grid"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {expanded.items.map((item) => (
                <div key={item.id} className="cp-product-card">
                  <div className="cp-img-container">
                    <img src={item.img} alt="" />
                    <button className="cp-add">
                      <ShoppingBag size={20} />
                    </button>
                  </div>
                  <h3>{item.name}</h3>
                  <p>{item.price}</p>
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
