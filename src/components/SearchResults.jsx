// src/components/SearchResults.jsx
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ShoppingBag, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AverageRating from "./AverageRating";
import "./SearchResults.css";

const SearchResults = () => {
  const { liveProducts, addToCart, addToWishlist, userData } = useAuth();
  const location = useLocation();

  // Extract search query from URL (?q=...)
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("q")?.toLowerCase() || "";

  // Filter products based on search term
  const filteredProducts = liveProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.category?.toLowerCase().includes(searchTerm),
  );

  return (
    <div className="sr-main-wrapper">
      {/* Header matching themed pages */}
      <div className="sr-header-section sr-mobile-16-9">
        <div className="sr-header-text">
          <h1>SEARCH: {searchTerm.toUpperCase()}</h1>
        </div>
      </div>

      <div className="sr-product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => {
            const isInWishlist = userData?.wishlist?.some(
              (w) => w.id === item.id,
            );

            return (
              <div key={item.id} className="sr-glass-card">
                <div className="sr-card-top">
                  <Link to={`/product/${item.id}`}>
                    <img
                      src={item.img}
                      alt={item.name}
                      className="sr-main-img"
                    />
                  </Link>

                  <div className="sr-rating-tag">
                    <AverageRating productId={item.id} />
                  </div>

                  <div className="sr-glass-actions">
                    <button
                      className={`sr-action-circle ${
                        isInWishlist ? "active" : ""
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
                      className="sr-action-rect"
                      onClick={() => addToCart(item, item.sizes?.[0] || "M")}
                    >
                      <ShoppingBag size={18} />
                      <span>ADD TO BAG</span>
                    </button>
                  </div>
                </div>

                <div className="sr-card-bottom">
                  <h3 className="sr-item-title">{item.name}</h3>
                  <p className="sr-item-price">{item.price} INR</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="sr-no-results">
            <h2>No results found for "{searchTerm}"</h2>
            <Link to="/all-products" className="sr-back-link">
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
