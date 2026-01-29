// src/components/MostWantedPage.jsx
import React, { useState, useEffect } from "react";
import { ArrowLeft, ShoppingBag, Heart } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import AverageRating from "./AverageRating";
import "./CollectionPage.css";
import "./MostWantedPage.css";

const MostWantedPage = () => {
  const { addToCart, addToWishlist, userData, liveProducts } = useAuth();
  const [targetIds, setTargetIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfig = async () => {
      const snap = await getDoc(doc(db, "siteSettings", "mostWanted"));
      if (snap.exists()) setTargetIds(snap.data().productIds || []);
    };
    fetchConfig();
  }, []);

  const products = liveProducts.filter((p) => targetIds.includes(p.id));

  return (
    <div
      className="cp-expanded-view1"
      style={{ position: "relative", minHeight: "100vh" }}
    >
      <div className="cp-shrunk-header mobile-16-9">
        <div className="cp-shrunk-bg">
          <img src="/DSC00618.JPG" alt="Most Wanted" />
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
                    className={`action-btn wishlist ${isInWishlist ? "active" : ""}`}
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
                <p className="cp-price">{item.price}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MostWantedPage;
