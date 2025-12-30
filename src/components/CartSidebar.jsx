// src/components/CartSidebar.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { X, Trash2, Plus, Minus, Heart } from "lucide-react";
import "./CartSidebar.css";

export default function CartSidebar({ isOpen, onClose }) {
  const { userData, updateCartQty, removeFromCart, moveToWishlistFromCart } =
    useAuth();

  const subtotal = userData.cart.reduce((acc, item) => {
    const priceNum = parseInt(item.price.replace(/[^0-9]/g, ""));
    return acc + priceNum * item.qty;
  }, 0);

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />
      <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Your Bag ({userData.cart.length})</h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="cart-items">
          {userData.cart.map((item, idx) => (
            <div key={`${item.id}-${item.color}`} className="cart-item">
              <img
                src={item.img || item.image}
                alt={item.name}
                className="item-img"
              />
              <div className="item-details">
                <div className="item-info-top">
                  <h4 className="item-name">{item.name}</h4>
                  <div className="item-meta">
                    {item.color && (
                      <span
                        className="color-indicator"
                        style={{ backgroundColor: item.color }}
                      />
                    )}
                    <button
                      onClick={() => moveToWishlistFromCart(item)}
                      className="move-wish-btn"
                    >
                      <Heart size={14} /> Move to Wishlist
                    </button>
                  </div>
                </div>

                <div className="item-price">{item.price}</div>

                <div className="item-actions">
                  <div className="qty-selector">
                    <button
                      onClick={() => updateCartQty(item.id, item.color, -1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() => updateCartQty(item.id, item.color, 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id, item.color)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {userData.cart.length === 0 && (
            <p className="empty-cart">Your bag is empty.</p>
          )}
        </div>

        <div className="sidebar-footer">
          <div className="subtotal">
            <span>Subtotal</span>
            <span className="amount">₹{subtotal.toLocaleString()}</span>
          </div>
          <button
            className="checkout-btn"
            disabled={userData.cart.length === 0}
          >
            CHECKOUT
          </button>
        </div>
      </div>
    </>
  );
}
