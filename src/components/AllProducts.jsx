import React from "react";
import { ShoppingBag, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AverageRating from "./AverageRating";
import "./AllProducts.css";

const AllProducts = () => {
  const { liveProducts, addToCart, addToWishlist, userData } = useAuth();

  return (
    <div className="ap-main-container4">
      {/* 1. Header matching Most Wanted 
          2. No back/close icon as requested
      */}
      <div className="cp-shrunk-header4 mobile-16-9">
        <div className="cp-header-overlay4">
          <h1>
            ALL PRODUCTS
          </h1>
        </div>
      </div>

      <div className="cp-grid">
        {liveProducts.map((item) => {
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

export default AllProducts;
