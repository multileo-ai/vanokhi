// src/components/NewArrivalsPage.jsx
import React from "react";
import { ShoppingBag, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AverageRating from "./AverageRating";
import "./NewArrivalsPage.css";

const NewArrivalsPage = () => {
  const { addToCart, addToWishlist, userData, liveProducts } = useAuth();

  // Get the latest products
  const products = [...liveProducts].reverse().slice(0, 9); // Taken 9 for even 3x3 grid

  return (
    <div className="na-main-wrapper">
      <div className="na-header-section na-mobile-16-9">
        <div className="na-header-bg">
          <img src="/DSC00618.avif" alt="New Arrivals" />
        </div>
        <div className="na-header-text">
          <h1>NEW ARRIVALS</h1>
        </div>
      </div>

      <div className="na-product-grid">
        {products.map((item) => {
          const isOutOfStock = item.stock === 0;
          const isInWishlist = userData?.wishlist?.some(
            (w) => w.id === item.id,
          );

          return (
            <div
              key={item.id}
              className={`na-glass-card ${isOutOfStock ? "out-of-stock" : ""}`}
            >
              <div className="na-card-top">
                <Link to={`/product/${item.id}`}>
                  <img src={item.img} alt={item.name} className="na-main-img" />
                </Link>

                <div className="na-rating-tag">
                  <AverageRating productId={item.id} />
                </div>

                <div className="na-glass-actions">
                  <button
                    className={`na-action-circle ${isInWishlist ? "active" : ""
                      }`}
                    onClick={() => addToWishlist(item)}
                  >
                    <Heart
                      size={18}
                      fill={isInWishlist ? "#860204" : "none"}
                      color={isInWishlist ? "#860204" : "white"}
                    />
                  </button>
                  <button
                    className="na-action-rect"
                    onClick={() => addToCart(item, "M", item.sizes?.[0] || "M")}
                  >
                    <ShoppingBag size={18} />
                    <span>ADD TO BAG</span>
                  </button>
                </div>
              </div>

              <div className="na-card-bottom">
                <h3 className="na-item-title">{item.name}</h3>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <p className="na-item-price">{item.price}</p>
                  {item.originalPrice && (
                    <p
                      className="na-item-price original"
                      style={{
                        textDecoration: "line-through",
                        color: "#999",
                        fontSize: "0.9em",
                      }}
                    >
                      {item.originalPrice}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewArrivalsPage;
