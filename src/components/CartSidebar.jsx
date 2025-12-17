import React from "react";
import "./CartSidebar.css";
import { X, Trash2, Plus, Minus } from "lucide-react";

export default function CartSidebar({ isOpen, onClose }) {
  // Mock Data - In real app, this comes from Context/Redux
  const cartItems = [
    {
      id: 1,
      name: "The Royal Silk Saree",
      variant: "Crimson Red / M",
      price: 12500,
      image: "/Rectangle 3.png", // Ensure this path exists in public/
      qty: 1,
    },
    {
      id: 2,
      name: "Vanokhi Gold Blouse",
      variant: "Size S",
      price: 3400,
      image: "/image 2.png",
      qty: 2,
    },
  ];

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />
      <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Your Bag ({cartItems.length})</h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="item-img" />
              <div className="item-details">
                <div>
                  <h4 className="item-name">{item.name}</h4>
                  <p className="item-variant">{item.variant}</p>
                </div>
                <div className="item-price">₹{item.price.toLocaleString()}</div>

                <div className="item-actions">
                  <div className="qty-selector">
                    <button>
                      <Minus size={14} />
                    </button>
                    <span>{item.qty}</span>
                    <button>
                      <Plus size={14} />
                    </button>
                  </div>
                  <button className="remove-btn">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="subtotal">
            <span>Subtotal</span>
            <span className="amount">₹19,300</span>
          </div>
          <p className="tax-note">Shipping & taxes calculated at checkout.</p>
          <button className="checkout-btn">CHECKOUT</button>
        </div>
      </div>
    </>
  );
}
