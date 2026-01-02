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
  Truck,
  ShieldCheck,
  Factory,
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
  const { addToCart, addToWishlist, user, currentUser, userData } = useAuth();
  const activeUser = user || currentUser;

  const [product, setProduct] = useState(null);
  const [mainImg, setMainImg] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedSize, setSelectedSize] = useState("M");

  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isInWishlist = userData?.wishlist.some((w) => w.id === product?.id);

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
      alert("Error posting review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!product)
    return <div className="vanokhi-loader">Loading Excellence...</div>;

  return (
    <div className="pdp-master-wrapper">
      {/* 1. LEFT RAIL: Size selection */}
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

      {/* 2. CENTER: Info & Tabs */}
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
              className={activeTab === "shipping" ? "active" : ""}
              onClick={() => setActiveTab("shipping")}
            >
              Shipping
            </button>
            <button
              className={activeTab === "manufacturing" ? "active" : ""}
              onClick={() => setActiveTab("manufacturing")}
            >
              Manufacturing
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
                  className="pdp-scroll-pane"
                >
                  <p className="pdp-text-content pre-wrap">
                    {product.description}
                  </p>
                  {product.details && (
                    <ul className="details-list">
                      {product.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}

              {activeTab === "shipping" && (
                <motion.div
                  key="ship"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pdp-scroll-pane"
                >
                  <div className="info-card">
                    <Truck size={18} />{" "}
                    <p className="pre-wrap">{product.shippingInfo}</p>
                  </div>
                  <div className="info-card">
                    <ShieldCheck size={18} />{" "}
                    <p className="pre-wrap">{product.returnPolicy}</p>
                  </div>
                </motion.div>
              )}

              {activeTab === "manufacturing" && (
                <motion.div
                  key="manuf"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pdp-scroll-pane"
                >
                  <div className="info-card">
                    <Factory size={18} />{" "}
                    <p className="pre-wrap">{product.manufacturing}</p>
                  </div>
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
                  <div className="modern-post-review">
                    <div className="star-rating-row">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          size={20}
                          fill={n <= newRating ? "#860204" : "none"}
                          color={n <= newRating ? "#860204" : "#ddd"}
                          onClick={() => setNewRating(n)}
                        />
                      ))}
                    </div>
                    <div className="input-with-send">
                      <textarea
                        placeholder="Feedback..."
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
                  <div className="modern-review-list">
                    {reviews.map((r) => (
                      <div key={r.id} className="modern-review-msg">
                        <div className="rev-msg-header">
                          <div className="rev-user-meta">
                            {r.userPhoto ? (
                              <img src={r.userPhoto} alt="u" />
                            ) : (
                              <div className="user-icon-alt">
                                <User size={12} />
                              </div>
                            )}{" "}
                            <span>{r.userName}</span>
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
                      </div>
                    ))}
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
            className={`luxe-wish-btn ${isInWishlist ? "active" : ""}`}
            onClick={() => addToWishlist(product)}
          >
            <Heart
              size={22}
              fill={isInWishlist ? "#ff0000" : "none"}
              color={isInWishlist ? "#ff0000" : "currentColor"}
            />
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
