import React from "react";
import { useAuth } from "../context/AuthContext";
import { Heart, ShoppingBag, X } from "lucide-react";
import "./WishlistPage.css";

export default function WishlistPage() {
  const { userData, addToCart } = useAuth();

  return (
    <div className="wishlist-page">
      <h1>My Wishlist ({userData.wishlist.length})</h1>
      <div className="wishlist-grid">
        {userData.wishlist.map((item) => (
          <div key={item.id} className="wishlist-card">
            <img src={item.img} alt={item.name} />
            <div className="wish-info">
              <h3>{item.name}</h3>
              <p>{item.price}</p>
              <button onClick={() => addToCart(item)}>
                <ShoppingBag size={16} /> Move to Bag
              </button>
            </div>
          </div>
        ))}
        {userData.wishlist.length === 0 && (
          <p className="empty-msg">Your wishlist is empty.</p>
        )}
      </div>
    </div>
  );
}
