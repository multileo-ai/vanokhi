// src/components/WishlistPage.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { ShoppingBag, Trash2 } from "lucide-react";
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
        <h1>My Wishlist ({userData.wishlist.length})</h1>
      </header>

      <div className="wishlist-grid">
        {userData.wishlist.map((item) => (
          <div key={item.id} className="wishlist-card">
            <div className="wishlist-img-container">
              <img src={item.img} alt={item.name} />
              <button
                className="remove-wish-overlay"
                onClick={() => removeFromWishlist(item.id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="wish-info">
              <h3>{item.name}</h3>
              <p className="wish-price">{item.price}</p>
              <button
                className="move-to-bag-btn"
                onClick={() => moveWishlistToCart(item)}
              >
                <ShoppingBag size={16} /> Move to Bag
              </button>
            </div>
          </div>
        ))}

        {userData.wishlist.length === 0 && (
          <div className="empty-wishlist">
            <p>Your wishlist is empty.</p>
            <button onClick={() => (window.location.href = "/collections")}>
              Explore Collections
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
