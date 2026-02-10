// src/components/ProductPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShoppingBag, Heart } from "lucide-react";
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
  const {
    addToCart,
    addToWishlist,
    user,
    currentUser,
    liveProducts,
    liveCollections,
    userData,
  } = useAuth();
  const activeUser = user || currentUser;

  // Logic to check if product is in wishlist
  const isInWishlist = userData?.wishlist?.some((item) => item.id === id);

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedImage, setSelectedImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const currentCollection = liveCollections.find(
    (col) => col.id === product?.collectionId,
  );
  const categoryName = currentCollection
    ? currentCollection.title
    : "Collection";

  useEffect(() => {
    if (liveProducts.length > 0) {
      const found = liveProducts.find((p) => p.id === id);
      if (found) {
        setProduct(found);
        setSelectedImage(found.galleryNormal?.[0] || found.img);

        // Fetch Reviews from Database
        const q = query(
          collection(db, `products/${id}/reviews`),
          orderBy("createdAt", "desc"),
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
          setReviews(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
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

  return (
    <div className="pdWrapper">
      {/* Exact UI matching reference */}
      <h1 className="catName">{categoryName}</h1>

      {/* --- MOBILE ONLY HERO SECTION --- */}
      <div className="mobileHeroContainer">
        <div className="mobileMainImg">
          <img src={selectedImage} alt={product.name} />
        </div>

        <div className="mobileThumbVertical">
          {product.galleryNormal?.map((img, i) => (
            <div
              key={i}
              className={`mobThumb ${selectedImage === img ? "active" : ""
                }`}
              onClick={() => setSelectedImage(img)}
            >
              <img src={img} alt="" />
            </div>
          ))}
        </div>

        <div className="mobileActionPanel">
          <h2 className="mobTitle">{product.name}</h2>
          <div className="mobPrice">
            {product.price} <span className="currency">INR</span>
          </div>

          <div className="mobSizeSelector">
            <div className="mobSizeHeader">
              <span>Select Size</span>
              <span
                className="mobSizeLink"
                onClick={() => setShowSizeChart(true)}
              >
                Size Chart
              </span>
            </div>
            <div className="mobSizeGrid">
              {product.sizes?.map((sz) => (
                <button
                  key={sz}
                  className={`mobSizeBtn ${selectedSize === sz ? "active" : ""
                    }`}
                  onClick={() => setSelectedSize(sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div className="mobButtons">
            <button
              className="mobBtn wishlist"
              onClick={() => addToWishlist(product)}
            >
              <Heart
                size={20}
                fill={isInWishlist ? "var(--primary)" : "none"}
              />
            </button>
            <button
              className="mobBtn cart"
              onClick={() => addToCart(product, selectedSize)}
            >
              <ShoppingBag size={20} /> Add to Bag
            </button>
          </div>
        </div>
      </div>

      {/* --- DESKTOP MAIN CONTAINER (Untouched for Desktop) --- */}
      <div className="prodMainCont desktopOnlyView">
        <div className="sizes">
          <div
            className="sizeChartCircle"
            onClick={() => setShowSizeChart(true)}
            title="View Size Chart"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
            >
              <path d="M21 16H3a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2z" />
              <line x1="7" y1="8" x2="7" y2="11" />
              <line x1="12" y1="8" x2="12" y2="13" />
              <line x1="17" y1="8" x2="17" y2="11" />
            </svg>
          </div>
          {product.sizes?.map((sz) => (
            <div
              key={sz}
              className={`size ${selectedSize === sz ? "selected" : ""}`}
              onClick={() => setSelectedSize(sz)}
              role="button"
            >
              <p>{sz}</p>
            </div>
          ))}
        </div>

        <div className="descWrapper">
          <div className="prodDesc">
            <h2 className="descTitle">{product.name}</h2>
            <p className="prodOverview">{product.overview}</p>
            <div className="price">
              {product.price} <span className="currency">INR</span>
            </div>

            {/* <div className="productActions">
              <button
                className={`action-btn1 wishlist ${
                  isInWishlist ? "active" : ""
                }`}
                onClick={() => addToWishlist(product)}
              >
                <Heart
                  size={18}
                  fill={isInWishlist ? "#860204" : "none"}
                  color={isInWishlist ? "#860204" : "currentColor"}
                />
              </button>
              <button
                className="action-btn1 cart"
                onClick={() => addToCart(product, selectedSize)}
              >
                <ShoppingBag size={18} /> Add to Bag
              </button>
            </div> */}

            <div className="productActions">
              <button
                className={`btnSecondary ${isInWishlist ? "active" : ""}`}
                onClick={() => addToWishlist(product)}
              >
                <Heart
                  size={20}
                  fill={isInWishlist ? "var(--primary)" : "none"}
                  color={isInWishlist ? "var(--primary)" : "currentColor"}
                />
              </button>
              <button
                className="btnPrimary"
                onClick={() => addToCart(product, selectedSize)}
              >
                <ShoppingBag size={18} style={{ marginRight: "8px" }} />
                Add to Bag
              </button>
            </div>
          </div>
        </div>

        <div className="gallery">
          <div className="mainImage">
            <img src={selectedImage} alt={product.name} fetchPriority="high" />
          </div>

          <div className="thumbs">
            {product.galleryNormal?.map((img, i) => (
              <button
                key={i}
                className={`thumb ${selectedImage === img ? "active" : ""
                  }`}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img} alt={`Thumbnail ${i}`} fetchpriority="high" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="productInfoSplit">
        {/* Left Side: Expandable Details */}
        <div className="detailsSection">
          <h3 className="reviewsTitle">Product Information</h3>
          <div className="accordion">
            <details className="accordionItem">
              <summary className="accordionHeader">
                Description <span className="icon">+</span>
              </summary>
              <div className="accordionContent preserve-space">
                {/* Show the Detailed Description here */}
                {product.description}
              </div>
            </details>

            <details className="accordionItem">
              <summary className="accordionHeader">
                Shipment & Exchange <span className="icon">+</span>
              </summary>
              <div className="accordionContent preserve-space">
                {`SHIPPING -
Free shipping for domestic & international orders
Product are dispatched from our warehouse within 2-5 working days. The order will be delivered in 3-10 working days depending on the pincode. You will receive order tracking number as soon as we ship your order.

EXCHANGE -
Free exchange withing 7 days
https://www.nishorama.com/apps/return_prime
There is no additional charge for any exchange orders.
International orders are not eligible for exchange
For new orders of lower price, the balance amount will be refunded as a gift voucher. Size exchange is subject to availability. Please share the package unboxing video for wrong product received.

RETURNS -
We have 7 days return policy
Please ensure that the products you return are unused, unworn and the original tags are intact.
International orders are not eligible for return.
Customer has to self-ship the product if the pin code is out of serviceable area with reverse logistic.
All orders will be refunded via gift cards, as payouts are currently on hold in compliance with RBI guidelines.`}
              </div>
            </details>

            <details className="accordionItem">
              <summary className="accordionHeader">
                Manufacturing <span className="icon">+</span>
              </summary>
              <div className="accordionContent preserve-space">
                {`Country of Origin: India

Manufactured and Marketed by - VANOKHI, Kharadi Bypass, Pune, Maharashtra 411014 India`}
              </div>
            </details>
          </div>
        </div>

        {/* Right Side: Your existing Review Box UI */}
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
                  className="revbtnPrimary"
                  disabled={submitting}
                >
                  {submitting ? "Posting..." : "Post review"}
                </button>
              </div>
            </div>
          </form>

          <ul className="reviewList">
            {reviews.map((r) => {
              const dateStr = r.createdAt?.toDate
                ? r.createdAt.toDate().toLocaleDateString()
                : "";
              return (
                <li className="reviewItem" key={r.id}>
                  <div className="avatar">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="3.2" />
                      <path d="M4 20c0-3.3 3.1-6 8-6s8 2.7 8 6" />
                    </svg>
                  </div>
                  <div className="reviewBody">
                    <div className="reviewHeader">
                      <div className="reviewUser">{r.userName}</div>
                      <div className="reviewStars">
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
                    <div className="reviewDate">{dateStr}</div>
                    {activeUser?.uid === r.userId && (
                      <button
                        className="deleteBtn"
                        onClick={() => handleDeleteReview(r.id)}
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

      {showSizeChart && (
        <div
          className="sizeModalOverlay"
          onClick={() => setShowSizeChart(false)}
        >
          <div
            className="sizeModalContent"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="closeModal"
              onClick={() => setShowSizeChart(false)}
            >
              &times;
            </button>
            <h3>Size Guide</h3>
            <table className="sizeTable">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest (in)</th>
                  <th>Waist (in)</th>
                  <th>Length (in)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>S</td>
                  <td>38</td>
                  <td>34</td>
                  <td>27</td>
                </tr>
                <tr>
                  <td>M</td>
                  <td>40</td>
                  <td>36</td>
                  <td>28</td>
                </tr>
                <tr>
                  <td>L</td>
                  <td>42</td>
                  <td>38</td>
                  <td>29</td>
                </tr>
                <tr>
                  <td>XL</td>
                  <td>44</td>
                  <td>40</td>
                  <td>30</td>
                </tr>
              </tbody>
            </table>
            <p className="sizeNote">
              * All measurements are in inches and subject to +/- 0.5"
              tolerance.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
