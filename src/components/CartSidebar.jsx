// src/components/CartSidebar.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  X,
  Trash2,
  Plus,
  Minus,
  Heart,
  CreditCard,
  Banknote,
} from "lucide-react";
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

  const [showPaymentSelection, setShowPaymentSelection] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const subtotal = userData.cart.reduce((acc, item) => {
    const priceNum = parseInt(item.price.replace(/[^0-9]/g, ""));
    return acc + priceNum * item.qty;
  }, 0);

  const processOrder = async (paymentMode, paymentId = "COD") => {
    const p = userData.profile;
    const orderData = {
      items: userData.cart.map((cartItem) => ({
        id: cartItem.id,
        name: cartItem.name,
        price: cartItem.price,
        img: cartItem.img || cartItem.image,
        size: cartItem.size || "Standard",
        qty: cartItem.qty,
        color: cartItem.color || "",
      })),
      total: subtotal,
      paymentMode: paymentMode, // "Online" or "COD"
      paymentStatus: paymentMode === "Online" ? "Paid" : "Pending",
      paymentId: paymentId,
      customerName: `${p.firstName} ${p.lastName}`,
      email: currentUser.email,
      shippingAddress: `${p.addressLine1}, ${p.addressLine2 || ""}, ${p.city
        }, ${p.state} - ${p.pinCode}, ${p.country}`,
      phone: p.phone,
    };

    try {
      await createOrder(orderData);
      toast.success("Order Placed Successfully!");
      navigate("/orders");
      onClose();
      setShowPaymentSelection(false);
    } catch (err) {
      toast.error("Failed to record order.");
    }
  };

  const handleOnlinePayment = () => {
    const p = userData.profile;
    const options = {
      key: "rzp_live_SA0hlT1msG7y4P",
      amount: subtotal * 100,
      currency: "INR",
      name: "Vanokhi",
      description: "Order Payment",
      handler: async function (response) {
        await processOrder("Online", response.razorpay_payment_id);
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

  const handleCheckout = () => {
    const p = userData.profile;
    const isProfileComplete =
      p.firstName &&
      p.lastName &&
      p.phone &&
      p.addressLine1 &&
      p.city &&
      p.state &&
      p.country &&
      p.pinCode;

    if (!isProfileComplete) {
      toast.error("Please complete your shipping details in Settings first!");
      navigate("/settings");
      onClose();
      return;
    }
    setShowPaymentSelection(true);
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />
      <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>
            {showPaymentSelection
              ? "Select Payment"
              : `Your Bag (${userData.cart.length})`}
          </h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="cart-content-wrapper">
          {!showPaymentSelection ? (
            <>
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
                          {/* NEW: Size Display */}
                          <span className="item-variant">
                            Size: {item.size || "Standard"}
                          </span>

                          {item.color && (
                            <span
                              className="color-indicator"
                              style={{ backgroundColor: item.color }}
                            />
                          )}
                        </div>

                        <button
                          onClick={() => moveToWishlistFromCart(item)}
                          className="move-wish-btn"
                        >
                          <Heart size={14} /> Move to Wishlist
                        </button>
                      </div>

                      <div className="item-price">{item.price}</div>

                      <div className="item-actions">
                        <div className="qty-selector">
                          <button
                            onClick={() =>
                              updateCartQty(item.id, item.color, -1)
                            }
                          >
                            <Minus size={14} />
                          </button>
                          <span>{item.qty}</span>
                          <button
                            onClick={() =>
                              updateCartQty(item.id, item.color, 1)
                            }
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
            </>
          ) : (
            <div className="payment-selection-container">
              <div className="payment-header-premium">
                <span className="premium-label">Secure Checkout</span>
                <h3 className="payment-title">Acquisition Method</h3>
                <div className="payment-divider"></div>
              </div>

              <div className="payment-methods-stack">
                {/* Online Payment Card */}
                <div
                  className="payment-card premium-card"
                  onClick={handleOnlinePayment}
                >
                  <div className="card-glow"></div>
                  <div className="card-content">
                    <div className="method-main">
                      <div className="method-icon online-icon">
                        <CreditCard size={22} />
                      </div>
                      <div className="method-details">
                        <span className="method-name">Online Payment</span>
                        <span className="method-sub">
                          UPI, Cards, & Netbanking
                        </span>
                      </div>
                    </div>
                    <div className="method-action">
                      <Plus size={18} />
                    </div>
                  </div>
                </div>

                {/* Cash on Delivery Card (DISABLED) */}
                <div
                  className="payment-card standard-card disabled-card"
                  title="Coming Soon"
                >
                  <div className="card-content">
                    <div className="method-main">
                      <div className="method-icon cod-icon">
                        <Banknote size={22} />
                      </div>
                      <div className="method-details">
                        <span className="method-name">Cash on Delivery</span>
                        <span className="method-sub coming-soon">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                    {/* <div className="method-action">
                      <Plus size={18} />
                    </div> */}
                  </div>
                </div>
              </div>

              <div className="payment-footer-minimal">
                {/* <div className="secure-badge">
                  <div className="dot"></div>
                  <span>256-bit Encrypted Transaction</span>
                </div> */}
                <button
                  className="back-link-minimal"
                  onClick={() => setShowPaymentSelection(false)}
                >
                  Return to Bag
                </button>
              </div>
            </div>
          )}
        </div>
        {!showPaymentSelection && userData.cart.length > 0 && (
          <div className="sidebar-footer">
            <div className="subtotal">
              <span>Subtotal</span>
              <span className="amount">₹{subtotal.toLocaleString()}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              CONTINUE TO PAYMENT
            </button>
          </div>
        )}
      </div>
    </>
  );
}
