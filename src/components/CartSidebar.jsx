// src/components/CartSidebar.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { X, Trash2, Plus, Minus, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./CartSidebar.css";

export default function CartSidebar({ isOpen, onClose }) {
  const {
    userData,
    updateCartQty,
    removeFromCart,
    moveToWishlistFromCart,
    currentUser,
    createOrder,
  } = useAuth();

  const navigate = useNavigate();

  const subtotal = userData.cart.reduce((acc, item) => {
    const priceNum = parseInt(item.price.replace(/[^0-9]/g, ""));
    return acc + priceNum * item.qty;
  }, 0);

  const handleCheckout = async () => {
    const p = userData.profile;

    // 1. Validate Profile Details
    const isProfileComplete =
      p.firstName &&
      p.lastName &&
      p.phone &&
      p.addressLine1 &&
      p.city &&
      p.state &&
      p.pinCode;

    if (!isProfileComplete) {
      toast.error("Please complete your shipping details in Settings first!");
      navigate("/settings");
      onClose();
      return;
    }

    // 2. Razorpay Integration
    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // Get from Razorpay Dashboard
      amount: subtotal * 100, // Amount in paise
      currency: "INR",
      name: "Vanokhi",
      description: "Order Payment",
      handler: async function (response) {
        // This runs on successful payment
        try {
          const orderData = {
            items: userData.cart,
            total: subtotal,
            paymentId: response.razorpay_payment_id,
            customerName: `${p.firstName} ${p.lastName}`,
            email: currentUser.email,
            shippingAddress: `${p.addressLine1}, ${p.addressLine2 || ""}, ${
              p.city
            }, ${p.state} - ${p.pinCode}`,
            phone: p.phone,
          };

          await createOrder(orderData);
          toast.success("Order Placed Successfully!");
          navigate("/orders"); // Create this route next
          onClose();
        } catch (err) {
          toast.error("Failed to save order details.");
        }
      },
      prefill: {
        name: `${p.firstName} ${p.lastName}`,
        email: currentUser.email,
        contact: p.phone,
      },
      theme: { color: "#860204" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

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
            onClick={handleCheckout}
          >
            CHECKOUT
          </button>
        </div>
      </div>
    </>
  );
}
