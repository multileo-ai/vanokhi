import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import Skeleton from "./common/Skeleton";

// ... existing imports

const OrdersPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ... useEffect ...

  // ... helpers ...

  if (loading)
    return (
      <div className="orders-wrapper">
        <header className="hero-header">
          <Skeleton
            type="title"
            style={{ width: "200px", margin: "0 auto 10px" }}
          />
          <div className="hero-line"></div>
          <Skeleton
            type="text"
            style={{ width: "300px", margin: "10px auto" }}
          />
        </header>

        <div className="orders-feed">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="premium-order-card"
              style={{ padding: "2rem" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <Skeleton type="text" style={{ width: "120px" }} />
                <Skeleton type="text" style={{ width: "80px" }} />
              </div>
              <Skeleton
                type="block"
                style={{ height: "100px", marginBottom: "1rem" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "auto",
                }}
              >
                <Skeleton type="text" style={{ width: "150px" }} />
                <Skeleton type="rect" style={{ width: "100px", height: "35px", borderRadius: "20px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="orders-wrapper">
      <header className="hero-header">
        <h1 className="hero-title">Order Archive</h1>
        <div className="hero-line"></div>
        <p className="hero-subtitle">
          Premium curation of your past acquisitions
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>Your archive is currently empty.</p>
          <button
            className="browse-btn"
            onClick={() => navigate("/all-products")}
          >
            Begin Your Collection
          </button>
        </div>
      ) : (
        <div className="orders-feed">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`premium-order-card ${order.status === "Cancelled" ? "order-cancelled" : ""
                }`}
            >
              {/* Top Banner: Order Meta */}
              <div className="card-meta-bar">
                <div className="meta-left">
                  <span className="meta-label">IDENTIFIER</span>
                  <span className="meta-id">
                    #{order.orderNumber.toUpperCase()}
                  </span>
                </div>
                <div className="meta-right">
                  <span className="meta-date">
                    {order.createdAt?.toDate
                      ? order.createdAt.toDate().toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      : "Processing"}
                  </span>
                </div>
              </div>

              {/* Wide Item Rows */}
              <div className="items-container">
                {order.items.map((item, idx) => (
                  <div key={idx} className="wide-item-row">
                    <div className="item-visual">
                      <img src={item.image || item.img} alt={item.name} />
                    </div>
                    <div className="item-content">
                      <div className="item-header">
                        <h3 className="item-brand-name">{item.name}</h3>
                        <span className="item-price-tag">{item.price}</span>
                      </div>

                      <div className="item-details-grid">
                        <div className="detail-box">
                          <label>Size</label>
                          <span>{item.size || "Standard"}</span>
                        </div>
                        <div className="detail-box">
                          <label>Quantity</label>
                          <span>{item.qty} units</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tracking & Total Section */}
              <div className="card-action-area">
                <div className="tracking-wrapper">
                  <div className="tracking-status-label">
                    Current Status:{" "}
                    <strong
                      className={
                        order.status === "Cancelled" ? "status-cancelled" : ""
                      }
                    >
                      {order.status}
                    </strong>
                  </div>

                  {order.status === "Cancelled" ? (
                    <div className="cancelled-message">
                      <p>This order has been cancelled.</p>
                      {order.paymentMode === "Online" && (
                        <small>
                          Refund will be processed within 5-7 business days.
                        </small>
                      )}
                    </div>
                  ) : (
                    <div className="tracker-container">
                      <div className="modern-tracker">
                        {/* The background line */}
                        <div className="tracker-bg-line"></div>
                        {/* The active progress line */}
                        <div
                          className="progress-line"
                          style={{
                            width: `${(getStatusStep(order.status) / 3) * 100}%`,
                          }}
                        ></div>

                        {["Placed", "Shipped", "Transit", "Arrived"].map(
                          (step, idx) => (
                            <div
                              key={step}
                              className={`step-dot ${idx <= getStatusStep(order.status)
                                ? "active"
                                : ""
                                }`}
                            >
                              <div className="dot-core"></div>
                              <span className="step-text">{step}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="order-summary">
                  <span className="summary-label">Invoice Total</span>
                  <span className="summary-amount">₹{order.total}</span>

                  {order.status === "Order Placed" && (
                    <button
                      className="cancel-order-btn"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
