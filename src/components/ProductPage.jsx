// src/components/ProductPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  ArrowLeft,
  Star,
  Send,
  Loader2,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { ALL_PRODUCTS } from "../data";
import "./ProductPage.css";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // We use both 'user' and 'currentUser' to ensure detection across different AuthContext versions
  const { addToCart, addToWishlist, user, currentUser } = useAuth();
  const activeUser = user || currentUser;

  const [product, setProduct] = useState(null);
  const [mainImg, setMainImg] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedSize, setSelectedSize] = useState("M");

  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const found = ALL_PRODUCTS.find((p) => p.id === parseInt(id));
    if (found) {
      setProduct(found);
      setMainImg(found.img);

      const q = query(
        collection(db, `products/${id}/reviews`),
        orderBy("createdAt", "desc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setReviews(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, [id]);

  const handlePostReview = async (e) => {
    e.preventDefault();
    if (!activeUser) return alert("Please login via Google to post a review.");
    if (!newComment.trim()) return alert("Please write a comment.");

    setSubmitting(true);
    try {
      await addDoc(collection(db, `products/${id}/reviews`), {
        userName: activeUser.displayName || "Vanokhi Guest",
        rating: newRating,
        comment: newComment,
        createdAt: serverTimestamp(),
        userId: activeUser.uid,
        userPhoto: activeUser.photoURL || null,
      });
      setNewComment("");
      setNewRating(5);
    } catch (err) {
      console.error("Firebase Error:", err);
      alert("Error posting review. Check your Firebase Rules.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!product)
    return <div className="vanokhi-loader">Loading Excellence...</div>;

  return (
    <div className="pdp-master-wrapper">
      {/* 1. LEFT RAIL: VERTICAL SIZES (Centered & Large) */}
      <div className="pdp-left-rail">
        <button className="pdp-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} />
        </button>
        <div className="pdp-rail-center-group">
          <span className="pdp-rail-label">SELECT SIZE</span>
          <div className="pdp-vertical-sizes">
            {product.sizes.map((s) => (
              <button
                key={s}
                className={`rail-size-btn ${
                  selectedSize === s ? "active" : ""
                }`}
                onClick={() => setSelectedSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. CENTER: PRODUCT INFO */}
      <div className="pdp-center-info">
        <div className="pdp-static-header">
          <span className="pdp-brand">VANOKHI • LUXE</span>
          <h1 className="pdp-title">{product.name}</h1>
          <p className="pdp-price">{product.price}</p>
        </div>

        <div className="pdp-tabs-system">
          <div className="tabs-header">
            <button
              className={activeTab === "description" ? "active" : ""}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={activeTab === "process" ? "active" : ""}
              onClick={() => setActiveTab("process")}
            >
              Process
            </button>
            <button
              className={activeTab === "reviews" ? "active" : ""}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          <div className="tabs-pane">
            <AnimatePresence mode="wait">
              {activeTab === "description" && (
                <motion.div
                  key="desc"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="pdp-text-content">{product.description}</p>
                  <ul className="details-list">
                    {product.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {activeTab === "process" && (
                <motion.div
                  key="proc"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="pdp-text-content">
                    Each Vanokhi piece undergoes a 48-hour hand-tailoring
                    process. We utilize traditional Indian looms and non-toxic,
                    botanical dyes to ensure the finest finish for your skin and
                    the environment.
                  </p>
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div
                  key="rev"
                  className="reviews-tab-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* FORM AT TOP */}
                  <div className="modern-post-review">
                    <div className="star-rating-row">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          size={20}
                          fill={n <= newRating ? "#860204" : "none"}
                          color={n <= newRating ? "#860204" : "#ddd"}
                          onClick={() => setNewRating(n)}
                          style={{ cursor: "pointer" }}
                        />
                      ))}
                    </div>
                    <div className="input-with-send">
                      <textarea
                        placeholder="Your feedback matters..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <button
                        className="minimal-send-btn"
                        onClick={handlePostReview}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <Send size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* INDIVIDUAL SCROLLABLE REVIEW LIST */}
                  <div className="modern-review-list">
                    {reviews.length > 0 ? (
                      reviews.map((r) => (
                        <div key={r.id} className="modern-review-msg">
                          <div className="rev-msg-header">
                            <div className="rev-user-meta">
                              {r.userPhoto ? (
                                <img src={r.userPhoto} alt="u" />
                              ) : (
                                <div className="user-icon-alt">
                                  <User size={12} />
                                </div>
                              )}
                              <span className="rev-name">{r.userName}</span>
                            </div>
                            <div className="rev-rating-stars">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={10}
                                  fill={i < r.rating ? "#860204" : "none"}
                                  color={i < r.rating ? "#860204" : "#ddd"}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="rev-msg-body">{r.comment}</p>
                          <span className="rev-msg-date">
                            {r.createdAt?.toDate().toLocaleDateString() ||
                              "Recently"}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="empty-reviews">
                        No reviews yet. Share your thoughts!
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="pdp-fixed-actions">
          <button
            className="luxe-add-btn"
            onClick={() => addToCart(product, product.colors[0])}
          >
            ADD TO BAG
          </button>
          <button
            className="luxe-wish-btn"
            onClick={() => addToWishlist(product)}
          >
            <Heart size={22} />
          </button>
        </div>
      </div>

      {/* 3. RIGHT: GALLERY */}
      <div className="pdp-right-gallery">
        <div className="gallery-layout-horizontal">
          <div className="main-display-box">
            <AnimatePresence mode="wait">
              <motion.img
                key={mainImg}
                src={mainImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
          </div>
          <div className="thumb-strip-right">
            {product.gallery?.map((img, i) => (
              <div
                key={i}
                className={`thumb-card-modern ${
                  mainImg === img ? "active" : ""
                }`}
                onClick={() => setMainImg(img)}
              >
                <img src={img} alt="thumb" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
