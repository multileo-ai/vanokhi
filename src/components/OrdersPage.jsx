import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import "./OrdersPage.css";

const OrdersPage = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "orders"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const getStatusStep = (status) => {
    const steps = ["Order Placed", "Shipped", "Out for Delivery", "Delivered"];
    const index = steps.indexOf(status);
    return index === -1 ? 0 : index;
  };

  if (loading)
    return (
      <div className="loading-screen">
        <div className="loader-text">VANOKHI</div>
        <p>Curating your history...</p>
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
            onClick={() => (window.location.href = "/category/all")}
          >
            Begin Your Collection
          </button>
        </div>
      ) : (
        <div className="orders-feed">
          {orders.map((order) => (
            <div key={order.id} className="premium-order-card">
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
                    Current Status: <strong>{order.status}</strong>
                  </div>

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
                            className={`step-dot ${
                              idx <= getStatusStep(order.status) ? "active" : ""
                            }`}
                          >
                            <div className="dot-core"></div>
                            <span className="step-text">{step}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                <div className="order-summary">
                  <span className="summary-label">Invoice Total</span>
                  <span className="summary-amount">₹{order.total}</span>
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
