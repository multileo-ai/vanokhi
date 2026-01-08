import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

export default function OrdersPage() {
  const { currentUser } = useAuth();
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "orders"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) => {
      setMyOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [currentUser]);

  return (
    <div className="orders-container" style={{ padding: "100px 20px" }}>
      <h1>My Orders</h1>
      {myOrders.map((order) => (
        <div key={order.id} className="order-card-user">
          <p>Order ID: #{order.id.slice(-6)}</p>
          <p>
            Status:{" "}
            <span className={`status-${order.status}`}>{order.status}</span>
          </p>
          <p>Total: ₹{order.total}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}
