import React from "react";
import { useAuth } from "../context/AuthContext";
import { ShoppingBag, Trash2, Heart } from "lucide-react";
import "./WishlistPage.css";

export default function WishlistPage() {
  const { userData, moveWishlistToCart, updateFirebase } = useAuth();

  const removeFromWishlist = async (id) => {
    const newWishlist = userData.wishlist.filter((item) => item.id !== id);
    await updateFirebase({ wishlist: newWishlist });
  };

  return (
    <div className="wishlist-page">
      <header className="wishlist-header">
        <h1>
          <Heart className="header-icon" /> My Wishlist (
          {userData.wishlist.length})
        </h1>
      </header>

      <div className="wishlist-grid">
        {userData.wishlist.map((item) => (
          <div key={item.id} className="wishlist-card">
            <div className="wishlist-img-container">
              <img src={item.img} alt={item.name} />
              <button
                className="remove-wish-overlay"
                onClick={() => removeFromWishlist(item.id)}
                title="Remove from wishlist"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <div className="wish-info">
              <h3>{item.name}</h3>
              <p className="wish-price">{item.price}</p>
              <button
                className="move-to-bag-btn"
                onClick={() => moveWishlistToCart(item)}
              >
                <ShoppingBag size={18} /> MOVE TO BAG
              </button>
            </div>
          </div>
        ))}
      </div>

      {userData.wishlist.length === 0 && (
        <div className="empty-state">
          <Heart size={48} strokeWidth={1} />
          <p>Your wishlist is waiting to be filled.</p>
          <button
            className="explore-btn"
            onClick={() => (window.location.href = "/collections")}
          >
            Explore Collections
          </button>
        </div>
      )}
    </div>
  );
}
