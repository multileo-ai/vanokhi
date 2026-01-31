import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  Package,
  ArrowRight,
  RotateCcw,
  RefreshCw,
  ChevronLeft,
  Calendar,
  AlertCircle,
  ShoppingBag,
  Clock,
} from "lucide-react";
import "./ReturnPortal.css";

export default function ReturnPortal() {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [userOrders, setUserOrders] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requestType, setRequestType] = useState("Return");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState({ type: "", msg: "" });

  // Real-time listener for user's return requests
  useEffect(() => {
    if (!currentUser) return;
    try {
      const q = query(
        collection(db, "returnRequests"),
        where("userId", "==", currentUser.uid),
      );
      const unsub = onSnapshot(
        q,
        (snap) => {
          setAllRequests(
            snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
          );
        },
        (err) => {
          console.error("Snapshot error:", err);
        },
      );
      return unsub;
    } catch (e) {
      console.error("Listener setup failed:", e);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const fetchUserOrders = async () => {
        setLoading(true);
        try {
          const q = query(
            collection(db, "orders"),
            where("userId", "==", currentUser.uid),
            orderBy("createdAt", "desc"),
          );
          const snap = await getDocs(q);
          setUserOrders(
            snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
          );
        } catch (err) {
          console.error("Order Fetch Error:", err);
        }
        setLoading(false);
      };
      fetchUserOrders();
    }
  }, [currentUser]);

  const getExistingRequest = (orderNumber) => {
    return allRequests.find(
      (req) => req.orderNumber === orderNumber && req.status === "Pending",
    );
  };

  const getLatestRequestStatus = (orderNumber) => {
    const sorted = allRequests
      .filter((req) => req.orderNumber === orderNumber)
      .sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
      );
    return sorted[0];
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setStatus({ type: "", msg: "" });
    try {
      const q = query(
        collection(db, "orders"),
        where("orderNumber", "==", searchQuery.trim()),
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setStatus({ type: "error", msg: "Order not found." });
      } else {
        const docSnap = querySnapshot.docs[0];
        setOrderData({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (err) {
      console.error("Search error:", err);
      setStatus({ type: "error", msg: "Search failed." });
    }
    setLoading(false);
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setStatus({ type: "error", msg: "Please provide a reason." });
      return;
    }

    setLoading(true);
    try {
      // PREVENT UNDEFINED: Firestore crashes if any field is undefined
      const requestPayload = {
        orderId: orderData.id || "manual_entry",
        orderNumber: orderData.orderNumber || searchQuery || "unknown",
        userId: currentUser?.uid || "guest",
        customerEmail:
          orderData.email ||
          orderData.customerEmail ||
          currentUser?.email ||
          "no-email@vanokhi.com",
        customerName:
          orderData.customerName ||
          orderData.userName ||
          currentUser?.displayName ||
          "Valued Customer",
        type: requestType || "Return",
        reason: reason.trim(),
        status: "Pending",
        createdAt: serverTimestamp(), // Firebase server time
      };

      await addDoc(collection(db, "returnRequests"), requestPayload);

      setStatus({
        type: "success",
        msg: "Concierge notified. Request pending.",
      });
      setOrderData(null);
      setReason("");
      setSearchQuery("");
    } catch (err) {
      console.error("SUBMISSION ERROR DETAILS:", err);
      setStatus({ type: "error", msg: "System Error. Check Console." });
    }
    setLoading(false);
  };

  const formatDate = (ts) => {
    if (!ts) return "Recently";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <div className="return-container">
      <div className="return-header-section">
        <span className="fragor-label">Concierge</span>
        <h1 className="vanokhi-title">
          <span>Returns & Exchanges</span>
        </h1>
        <p className="montserrat-sub">
          Resolution portal for your Vanokhi essentials
        </p>
      </div>

      <div className="portal-inner">
        {!orderData ? (
          <>
            <form className="luxury-search-form" onSubmit={handleSearch}>
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="ORDER ID (e.g. #VK1024)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-cta" disabled={loading}>
                {loading ? "..." : "LOCATE"}
              </button>
            </form>

            <div className="orders-interaction-area">
              <h2 className="area-heading">Recent Purchases</h2>
              {userOrders.length > 0 ? (
                <div className="orders-grid">
                  {userOrders.map((order) => {
                    const latestReq = getLatestRequestStatus(order.orderNumber);
                    return (
                      <div
                        key={order.id}
                        className="order-glass-card"
                        onClick={() => setOrderData(order)}
                      >
                        <div className="card-top">
                          <span className="card-id">#{order.orderNumber}</span>
                          {latestReq && (
                            <span
                              className={`mini-status-tag ${latestReq.status.toLowerCase()}`}
                            >
                              {latestReq.status}
                            </span>
                          )}
                        </div>
                        <div className="card-visuals">
                          {order.items?.slice(0, 3).map((item, i) => (
                            <img
                              key={i}
                              src={item.img}
                              alt=""
                              className="item-peek"
                            />
                          ))}
                        </div>
                        <div className="card-bottom">
                          <span className="item-count">
                            {order.items?.length || 0} ITEMS
                          </span>
                          <div className="arrow-circle">
                            <ArrowRight size={16} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-orders-luxury">
                  <ShoppingBag size={40} strokeWidth={1} />
                  <h3>Waiting for your first essential</h3>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="request-manifest-card glass-morph">
            <button className="back-nav" onClick={() => setOrderData(null)}>
              <ChevronLeft size={18} /> BACK
            </button>

            <div className="manifest-content">
              <div className="manifest-items">
                <p className="manifest-label">ORDER CONTENT</p>
                <div className="manifest-scroll-area">
                  {orderData.items?.map((item, i) => (
                    <div key={i} className="manifest-row">
                      <img src={item.img} alt="" />
                      <div className="row-info">
                        <h4>{item.name}</h4>
                        <span>
                          SIZE {item.size} • {item.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="manifest-form">
                {getExistingRequest(orderData.orderNumber) ? (
                  <div className="locked-request-box">
                    <Clock size={32} className="pending-icon" />
                    <h3>Request Pending</h3>
                    <p>
                      Our concierge team is reviewing your previous request.
                      You'll be notified via email once approved.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="manifest-label">RESOLUTION</p>
                    <div className="toggle-group">
                      <button
                        type="button"
                        className={requestType === "Return" ? "active" : ""}
                        onClick={() => setRequestType("Return")}
                      >
                        <RotateCcw size={16} /> RETURN
                      </button>
                      <button
                        type="button"
                        className={requestType === "Exchange" ? "active" : ""}
                        onClick={() => setRequestType("Exchange")}
                      >
                        <RefreshCw size={16} /> EXCHANGE
                      </button>
                    </div>

                    <p className="manifest-label">REASONING</p>
                    <textarea
                      placeholder="Why would you like to proceed with this request?"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />

                    <button
                      className="primary-submit-btn"
                      onClick={handleSubmitRequest}
                      disabled={loading}
                    >
                      {loading ? "..." : `CONFIRM ${requestType.toUpperCase()}`}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {status.msg && (
        <div className={`notification-toast ${status.type}`}>
          <AlertCircle size={18} /> {status.msg}
        </div>
      )}
    </div>
  );
}
