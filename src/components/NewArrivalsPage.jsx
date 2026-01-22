// src/components/NewArrivalsPage.jsx
import React from "react";
import { X, ShoppingBag, ArrowLeft, Heart } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AverageRating from "./AverageRating";
import "./CollectionPage.css"; // Reuse your existing CSS

const NewArrivalsPage = () => {
  const { addToCart, addToWishlist, userData, liveProducts } = useAuth();
  const navigate = useNavigate();

  // Get the latest 8 products
  const products = [...liveProducts].reverse().slice(0, 8);

  return (
    <div className="cp-expanded-view" style={{ position: "relative", minHeight: "100vh" }}>
      <div className="cp-shrunk-header mobile-16-9">
        <div className="cp-shrunk-bg">
          <img src="/newarivals.png" alt="New Arrivals" />
        </div>
        <div className="cp-header-overlay">
          <h1>New Arrivals</h1>
        </div>
      </div>

      <div className="cp-grid">
        {products.map((item) => {
          const isInWishlist = userData?.wishlist?.some((w) => w.id === item.id);
          return (
            <div key={item.id} className="cp-product-card">
              <div className="cp-img-container">
                <Link to={`/product/${item.id}`}>
                  <img src={item.img} alt={item.name} />
                </Link>
                <AverageRating productId={item.id} />
                <div className="cp-product-actions">
                  <button className={`action-btn wishlist ${isInWishlist ? "active" : ""}`} onClick={() => addToWishlist(item)}>
                    <Heart size={18} fill={isInWishlist ? "#860204" : "none"} color={isInWishlist ? "#860204" : "currentColor"} />
                  </button>
                  <button className="action-btn cart" onClick={() => addToCart(item, item.colors?.[0])}>
                    <ShoppingBag size={18} /> Add to Bag
                  </button>
                </div>
              </div>
              <div className="cp-product-info">
                <Link to={`/product/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <h3>{item.name}</h3>
                </Link>
                <p className="cp-price">{item.price}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewArrivalsPage;