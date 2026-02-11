// src/components/MostWantedPage.jsx
import React, { useState, useEffect } from "react";
import { ArrowLeft, ShoppingBag, Heart } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import AverageRating from "./AverageRating";
// import "./CollectionPage.css";
import "./MostWantedPage.css";
import Skeleton from "./common/Skeleton";

const MostWantedPage = () => {
  const { addToCart, addToWishlist, userData, liveProducts } = useAuth();
  const [targetIds, setTargetIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const navigate = useNavigate();

  const isPageReady = !loading && bannerLoaded;

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const snap = await getDoc(doc(db, "siteSettings", "mostWanted"));
        if (snap.exists()) setTargetIds(snap.data().productIds || []);
      } catch (error) {
        console.error("Error fetching most wanted:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const products = liveProducts.filter((p) => targetIds.includes(p.id));

  return (
    <div
      className="cp-expanded-view1"
      style={{ position: "relative", minHeight: "100vh" }}
    >
      {!isPageReady && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "#fff",
            overflowY: "auto",
          }}
        >
          <div className="cp-shrunk-header mobile-16-9">
            <Skeleton type="block" style={{ width: "100%", height: "100%" }} />
          </div>
          <div className="cp-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="cp-product-card">
                <Skeleton
                  type="block"
                  style={{
                    aspectRatio: "3/4",
                    width: "100%",
                    borderRadius: "15px",
                  }}
                />
                <div className="cp-product-info" style={{ marginTop: "15px" }}>
                  <Skeleton
                    type="text"
                    style={{ width: "80%", marginBottom: "10px" }}
                  />
                  <Skeleton type="text" style={{ width: "50%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ visibility: isPageReady ? "visible" : "hidden" }}>
        <div className="cp-shrunk-header mobile-16-9">
          <div className="cp-shrunk-bg">
            <img
              src="/DSC00618.avif"
              alt="Most Wanted"
              onLoad={() => setBannerLoaded(true)}
            />
          </div>
          <div className="cp-header-overlay">
            <h1>Most Wanted</h1>
          </div>
        </div>

        <div className="cp-grid">
          {products.map((item) => {
            const isInWishlist = userData?.wishlist?.some(
              (w) => w.id === item.id,
            );
            return (
              <div key={item.id} className="cp-product-card">
                <div className="cp-img-container">
                  <Link to={`/product/${item.id}`}>
                    <img src={item.img} alt={item.name} />
                  </Link>
                  <AverageRating productId={item.id} />
                  <div className="cp-product-actions">
                    <button
                      className={`action-btn wishlist ${isInWishlist ? "active" : ""
                        }`}
                      onClick={() => addToWishlist(item)}
                    >
                      <Heart
                        size={18}
                        fill={isInWishlist ? "#860204" : "none"}
                        color={isInWishlist ? "#860204" : "currentColor"}
                      />
                    </button>
                    <button
                      className="action-btn cart"
                      onClick={() => addToCart(item, item.colors?.[0])}
                    >
                      <ShoppingBag size={18} /> Add to Bag
                    </button>
                  </div>
                </div>
                <div className="cp-product-info">
                  <h3>{item.name}</h3>
                  <div className="mw-price-row">
                    <span className="mw-price">{item.price}</span>
                    {item.originalPrice && (
                      <span
                        className="mw-price original"
                        style={{
                          textDecoration: "line-through",
                          color: "#999",
                          fontSize: "0.9em",
                          marginLeft: "8px",
                        }}
                      >
                        {item.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MostWantedPage;
