import React from "react";
import { ShoppingBag, Trash2, ArrowLeft, Heart } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AverageRating from "./AverageRating";
import "./WishlistPage.css";

const WishlistPage = () => {
  const { userData, addToCart, addToWishlist } = useAuth();
  const navigate = useNavigate();

  const products = userData.wishlist || [];

  return (
    <div className="cp-expanded-view1">
      {/* Header exactly matching the CSS provided */}
      <div className="cp-shrunk-header1 mobile-16-9">
        
        <div className="cp-header-overlay">
          <h1>
            <span>My Wishlist</span>
          </h1>
        </div>
        <button className="cp-close" onClick={() => navigate("/")}>
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="cp-grid">
        {products.map((item) => (
          <div key={item.id} className="cp-product-card">
            <div className="cp-img-container">
              <Link to={`/product/${item.id}`}>
                <img src={item.img} alt={item.name} />
              </Link>

              <AverageRating productId={item.id} />

              <div className="cp-product-actions">
                <button
                  className="action-btn wishlist"
                  onClick={() => addToWishlist(item)}
                  title="Remove from wishlist"
                >
                  <Trash2 size={18} />
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
        ))}
      </div>

      {products.length === 0 && (
        <div className="no-orders-luxury">
          <div className="empty-icon-wrap">
            <Heart size={40} strokeWidth={1} />
          </div>
          <h3>Your wishlist is empty</h3>
          <p>Discover our latest collection and save your favorites here.</p>
          <button
            className="shop-link-btn"
            onClick={() => navigate("/all-products")}
          >
            Explore Collection
          </button>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
