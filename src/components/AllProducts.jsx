import React from "react";
import { ShoppingBag, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AverageRating from "./AverageRating";
import "./AllProducts.css";
import Skeleton from "./common/Skeleton";

const AllProducts = () => {
  const { liveProducts, addToCart, addToWishlist, userData } = useAuth();

  return (
    <div className="ap-main-container4">
      {/* 1. Header matching Most Wanted 
          2. No back/close icon as requested
      */}
      <div className="cp-shrunk-header4 mobile-16-9">
        <div className="cp-header-overlay4">
          <h1>ALL PRODUCTS</h1>
        </div>
      </div>

      <div className="cp-grid">
        {liveProducts.length === 0
          ? [...Array(6)].map((_, i) => (
            <div key={i} className="cp-product-card">
              <Skeleton
                type="block"
                style={{ aspectRatio: "3/4", width: "100%", borderRadius: "15px" }}
              />
              <div className="cp-product-info" style={{ marginTop: "15px" }}>
                <Skeleton
                  type="text"
                  style={{ width: "80%", marginBottom: "10px" }}
                />
                <Skeleton type="text" style={{ width: "50%" }} />
              </div>
            </div>
          ))
          : liveProducts.map((item) => {
            const isInWishlist = userData?.wishlist?.some(
              (w) => w.id === item.id,
            );
            const isOutOfStock = item.stock === 0;

            return (
              <div
                key={item.id}
                className={`cp-product-card ${isOutOfStock ? "out-of-stock" : ""
                  }`}
              >
                <div className="cp-img-container">
                  <Link to={isOutOfStock ? "#" : `/product/${item.id}`}>
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
                      onClick={() => addToCart(item, "M", item.colors?.[0])}
                    >
                      <ShoppingBag size={18} /> Add to Bag
                    </button>
                  </div>
                </div>

                <div className="cp-product-info">
                  <h3 className="global-product-name">{item.name}</h3>
                  <div className="global-price-row">
                    <span className="global-product-price">{item.price}</span>
                    {item.originalPrice && (
                      <span className="global-product-price-original">
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
  );
};

export default AllProducts;
