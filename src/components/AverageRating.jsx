import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Star } from "lucide-react";

export default function AverageRating({ productId }) {
  const [data, setData] = useState({ avg: 0, count: 0 });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, `products/${productId}/reviews`),
      (snap) => {
        const revs = snap.docs.map((d) => d.data());
        if (revs.length > 0) {
          const total = revs.reduce((acc, curr) => acc + curr.rating, 0);
          setData({
            avg: (total / revs.length).toFixed(1),
            count: revs.length,
          });
        } else {
          setData({ avg: 0, count: 0 });
        }
      }
    );
    return () => unsubscribe();
  }, [productId]);

  if (data.count === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "0.75rem",
        fontFamily: "myMontserrat",
        color: "#860204",
        marginTop: "5px",
      }}
    >
      <Star size={10} fill="#860204" />
      <span>
        {data.avg} ({data.count})
      </span>
    </div>
  );
}
