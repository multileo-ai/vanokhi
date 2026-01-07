// src/components/ProductPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import "./ProductPage.css";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, user, currentUser, liveProducts } = useAuth();
  const activeUser = user || currentUser;

  const [product, setProduct] = useState(null);
  const [mainImg, setMainImg] = useState("");
  const [activeTab, setActiveTab] = useState("Description");
  const [selectedSize, setSelectedSize] = useState("M");

  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (liveProducts.length > 0) {
      const found = liveProducts.find((p) => p.id === id);
      if (found) {
        setProduct(found);
        // prefer gallery first, then img field, then fallback placeholder
        setMainImg(found.gallery?.[0] || found.img || "/img_1.png");

        const q = query(
          collection(db, `products/${id}/reviews`),
          orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
          setReviews(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        });
        return () => unsubscribe();
      }
    }
  }, [id, liveProducts]);

  const handlePostReview = async (e) => {
    e.preventDefault();
    if (!activeUser) return alert("Please login to post a review.");
    if (!newComment.trim()) return alert("Please write a comment.");

    setSubmitting(true);
    try {
      await addDoc(collection(db, `products/${id}/reviews`), {
        userName: activeUser.displayName || "Vanokhi Guest",
        rating: newRating,
        comment: newComment,
        createdAt: serverTimestamp(),
        userId: activeUser.uid,
      });
      setNewComment("");
      setNewRating(5);
    } catch (err) {
      console.error("Firebase Error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!activeUser) return alert("Please login to delete your review.");
    try {
      await deleteDoc(doc(db, `products/${id}/reviews/${reviewId}`));
    } catch (err) {
      console.error("Firebase Error (delete):", err);
    }
  };

  if (!product)
    return <div className="vanokhi-loader">Loading Excellence...</div>;

  const tabs = ["Description", "Shipping", "Manufacturing"];
  const tabContent = {
    Description: product.description,
    Shipping: product.shippingInfo || "Free standard shipping on all orders.",
    Manufacturing:
      product.manufacturing || "Handcrafted with premium materials.",
  };

  return (
    <div className="pdWrapper">
      {/* 100% Matching Header Text */}
      {/* show collection/category in the large faded heading like reference */}
      <h1 className="prodName">{product.name}</h1>

      <div className="prodMainCont">
        {/* 1. SIZES SECTION */}
        <div className="sizes">
          {product.sizes?.map((sz) => (
            <div
              key={sz}
              className={`size ${selectedSize === sz ? "selected" : ""}`}
              onClick={() => setSelectedSize(sz)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelectedSize(sz);
              }}
              aria-pressed={selectedSize === sz}
            >
              <p>{sz}</p>
            </div>
          ))}
        </div>

        {/* 2. DESCRIPTION SECTION */}
        <div className="descWrapper">
          <div className="prodDesc">
            <div className="descLabel">— DETAILS</div>
            <h2 className="descTitle">{product.name}</h2>
            <p className="descText">{tabContent[activeTab]}</p>
            <div className="price">
              {product.price} <span className="currency">INR</span>
            </div>

            {/* Added Add to Bag Button styled exactly like the reference primary btn */}
            <div
              className="reviewActions"
              style={{ justifyContent: "flex-start", marginTop: "20px" }}
            >
              <button
                className="btnPrimary"
                onClick={() => addToCart(product, selectedSize)}
              >
                Add to Bag
              </button>
            </div>
          </div>

          <div className="infoTabs" role="region">
            <div className="tabButtons" role="tablist">
              {tabs.map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={activeTab === t}
                  tabIndex={0}
                  className={`tabButton ${activeTab === t ? "active" : ""}`}
                  onClick={() => setActiveTab(t)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setActiveTab(t);
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. GALLERY SECTION */}
        <div className="gallery">
          <div className="mainImage">
            <AnimatePresence mode="wait">
              <motion.img
                key={mainImg}
                src={"/img_1.png"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.24 }}
                alt={product.name}
              />
            </AnimatePresence>
          </div>

          <div className="thumbs">
            {product.gallery?.map((img, i) => (
              <button
                key={i}
                className={`thumb ${mainImg === img ? "active" : ""}`}
                onClick={() => setMainImg(img)}
                tabIndex={0}
                aria-pressed={mainImg === img}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setMainImg(img);
                }}
              >
                <img src={img} alt={`Thumbnail ${i}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION - EXACT REPLICATION */}
      <div className="reviewsSection">
        <h3 className="reviewsTitle">Customer Reviews</h3>

        <form className="reviewForm" onSubmit={handlePostReview}>
          <div className="reviewLeft">
            <div className="avatar small">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="3.2" />
                <path d="M4 20c0-3.3 3.1-6 8-6s8 2.7 8 6" />
              </svg>
            </div>
          </div>
          <div className="reviewRight">
            <div className="ratingInput">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  className={`star ${newRating >= n ? "on" : ""}`}
                  onClick={() => setNewRating(n)}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              className="reviewInput"
              placeholder="Write your review..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <div className="reviewActions">
              <button
                type="submit"
                className="btnPrimary"
                disabled={submitting}
              >
                {submitting ? "Posting..." : "Post review"}
              </button>
            </div>
          </div>
        </form>

        <ul className="reviewList">
          {reviews.map((r) => {
            const date =
              r.createdAt && typeof r.createdAt.toDate === "function"
                ? r.createdAt.toDate()
                : r.createdAt
                ? new Date(r.createdAt)
                : null;
            return (
              <li className="reviewItem" key={r.id}>
                <div className="avatar">
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <circle cx="12" cy="8" r="3.2" />
                    <path d="M4 20c0-3.3 3.1-6 8-6s8 2.7 8 6" />
                  </svg>
                </div>
                <div className="reviewBody">
                  <div className="reviewHeader">
                    <div className="reviewUser">{r.userName}</div>
                    <div className="reviewStars" aria-hidden>
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`star ${i < r.rating ? "on" : ""}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="reviewText">{r.comment}</div>
                </div>

                <div className="reviewMeta">
                  <div className="reviewDate">
                    {date ? date.toLocaleDateString() : ""}
                  </div>
                  {activeUser && activeUser.uid === r.userId && (
                    <button
                      className="deleteBtn"
                      onClick={() => handleDeleteReview(r.id)}
                      aria-label="Delete review"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
