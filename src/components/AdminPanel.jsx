// src/components/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  collectionGroup,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {
  Plus,
  Trash2,
  Package,
  Layers,
  Edit3,
  Save,
  X,
  Search,
  ShoppingCart,
  Star,
  Image as ImageIcon,
  Check,
  Ban,
  AlertTriangle,
  Instagram,
  MessageSquare,
  Trash,
  ExternalLink,
  MoreVertical,
  Box,
  Truck,
  CheckCircle,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";
import "./AdminPanel.css";
import Skeleton from "./common/Skeleton";

export default function AdminPanel() {
  const { userData, liveProducts, liveCollections } = useAuth();
  const [activeTab, setActiveTab] = useState("inventory");
  const [allOrders, setAllOrders] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mostWantedIds, setMostWantedIds] = useState([]);
  const [requests, setRequests] = useState([]);

  // --- STATE: INVENTORY ---
  const [newColl, setNewColl] = useState({ title: "", tagline: "", img: "" });
  const [newProd, setNewProd] = useState({
    name: "",
    price: "",
    originalPrice: "", // NEW: MRP
    img: "",
    collectionId: "",
    stock: 0,
    overview: "",
    description: "",
    sizes: "XS,S,M,L,XL",
    colors: "#860204,#000000,#ffffff",
    shippingInfo: "",
    returnPolicy: "",
    manufacturing: "",
    details: "",
    galleryNormal: Array(4).fill(""), // Changed to parallel array structure
    galleryPNG: Array(4).fill(""), // Changed to parallel array structure
  });

  // --- STATE: INSTAGRAM FEED ---
  const [instaPosts, setInstaPosts] = useState([]);
  const [newInsta, setNewInsta] = useState({
    img: "",
    instalink: "",
    likes: "",
    comments: "",
    type: "image",
  });
  const [editingInsta, setEditingInsta] = useState(null);

  // --- STATE: REVIEWS MODERATION ---
  const [allReviews, setAllReviews] = useState([]);

  const [editingProd, setEditingProd] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "returnRequests"), (snap) => {
      setRequests(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    await updateDoc(doc(db, "returnRequests", id), { status: newStatus });
  };

  const handleGalleryChange = (type, index, value) => {
    if (type === "normal") {
      const updatedNormal = [...newProd.galleryNormal];
      updatedNormal[index] = value;
      setNewProd({ ...newProd, galleryNormal: updatedNormal });
    } else {
      const updatedPNG = [...newProd.galleryPNG];
      updatedPNG[index] = value;
      setNewProd({ ...newProd, galleryPNG: updatedPNG });
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      // Save arrays while maintaining positions
      const docRef = await addDoc(collection(db, "products"), {
        ...newProd,
        price: `₹${newProd.price}`,
        originalPrice: newProd.originalPrice
          ? `₹${newProd.originalPrice}`
          : "",
        sizes: newProd.sizes.split(","),
        colors: newProd.colors.split(","),
        details: newProd.details.split("\n"),
        stock: parseInt(newProd.stock),
        overview: newProd.overview,
        galleryNormal: newProd.galleryNormal,
        galleryPNG: newProd.galleryPNG,
      });

      if (newProd.collectionId) {
        const collectionRef = doc(db, "collections", newProd.collectionId);
        await updateDoc(collectionRef, {
          productIds: arrayUnion(docRef.id),
        });
      }
      alert("Product Published!");
    } catch (err) {
      alert(err.message);
    }
  };

  // --- STATE: ORDERS ---
  const [orders, setOrders] = useState([]);

  // --- STATE: SITE CONTENT ---
  const [heroData, setHeroData] = useState({
    bannerUrl: "",
    mobileBannerUrl: "",
    tagline: "",
  });
  const [newArrivalPoster, setNewArrivalPoster] = useState("");
  const [storyImages, setStoryImages] = useState({ img1: "", img2: "" });

  const toggleMostWanted = async (productId) => {
    const docRef = doc(db, "siteSettings", "mostWanted");
    const isCurrentlyWanted = mostWantedIds.includes(productId);

    const updatedIds = isCurrentlyWanted
      ? mostWantedIds.filter((id) => id !== productId)
      : [...mostWantedIds, productId];

    try {
      await setDoc(docRef, { productIds: updatedIds }, { merge: true });
      setMostWantedIds(updatedIds); // Update local state for instant UI feedback
    } catch (err) {
      console.error("Error updating Most Wanted:", err);
      alert("Failed to update list.");
    }
  };

  useEffect(() => {
    const fetchMostWanted = async () => {
      const docRef = doc(db, "siteSettings", "mostWanted");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMostWantedIds(docSnap.data().productIds || []);
      }
    };
    if (userData?.isAdmin) fetchMostWanted();
  }, [userData]);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      toast.success(`Updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    if (!userData?.isAdmin) return;

    // Listen to Instagram Posts
    const qInsta = query(
      collection(db, "instagramPosts"),
      orderBy("createdAt", "desc"),
    );
    const unsubInsta = onSnapshot(qInsta, (snap) => {
      setInstaPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const qReviews = query(
      collectionGroup(db, "reviews"),
      orderBy("createdAt", "desc"),
    );

    const unsubReviews = onSnapshot(qReviews, (snap) => {
      setAllReviews(
        snap.docs.map((d) => {
          const data = d.data();
          // d.ref.parent is the 'reviews' collection
          // d.ref.parent.parent is the 'product' document
          const parentProdId = d.ref.parent.parent?.id;

          return {
            id: d.id,
            productId: parentProdId, // Ensure this key matches what you use in deleteReview
            ...data,
          };
        }),
      );
    });

    const qOrders = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc"),
    );
    const unsubOrders = onSnapshot(qOrders, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const fetchHero = async () => {
      const docRef = doc(db, "siteSettings", "hero");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setHeroData(docSnap.data());
    };
    fetchHero();

    const fetchPoster = async () => {
      const docRef = doc(db, "siteSettings", "posters");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists())
        setNewArrivalPoster(docSnap.data().newArrivalsUrl || "");
    };
    fetchPoster();

    const fetchStoryContent = async () => {
      const docRef = doc(db, "siteSettings", "brandStory");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setStoryImages(docSnap.data());
      }
    };
    fetchStoryContent();

    return () => {
      unsubOrders();
      unsubInsta();
      unsubReviews();
    };
  }, [userData]);

  const updateNewArrivalPoster = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "siteSettings", "posters");
      // Use setDoc with merge to ensure the document is created if it doesn't exist
      await setDoc(
        docRef,
        { newArrivalsUrl: newArrivalPoster },
        { merge: true }
      );
      alert("New Arrivals Poster Updated!");
      // Optional: Re-fetch or rely on the fact that landing page uses onSnapshot
    } catch (err) {
      alert("Error updating poster: " + err.message);
    }
  };

  const updateStoryContent = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "siteSettings", "brandStory");
      await setDoc(docRef, storyImages, { merge: true });
      alert("Brand Story Images Updated!");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (!userData?.isAdmin)
    return <div className="admin-denied">Admin Access Required.</div>;

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "collections"), { ...newColl, productIds: [] });
    alert("Collection Created!");
    setNewColl({ title: "", subtitle: "", img: "" });
  };

  // --- INSTAGRAM ACTIONS ---
  const handleAddInsta = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "instagramPosts"), {
      ...newInsta,
      likes: parseInt(newInsta.likes) || 0,
      comments: parseInt(newInsta.comments) || 0,
      createdAt: serverTimestamp(),
    });
    setNewInsta({
      img: "",
      instalink: "",
      likes: "",
      comments: "",
      type: "image",
    });
  };

  const handleUpdateInsta = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "instagramPosts", editingInsta.id);
    await updateDoc(docRef, {
      ...editingInsta,
      likes: parseInt(editingInsta.likes),
      comments: parseInt(editingInsta.comments),
    });
    setEditingInsta(null);
  };

  const deleteInsta = async (id) => {
    if (window.confirm("Delete this post?"))
      await deleteDoc(doc(db, "instagramPosts", id));
  };

  // --- REVIEW ACTIONS ---
  const deleteReview = async (productId, reviewId) => {
    // Debugging logs to see which one is undefined
    console.log("Deleting Review:", { productId, reviewId });

    if (!productId || !reviewId) {
      alert("Error: Missing Product ID or Review ID");
      return;
    }

    if (window.confirm("Delete this review?")) {
      try {
        // Path: products/{productId}/reviews/{reviewId}
        const reviewRef = doc(db, "products", productId, "reviews", reviewId);
        await deleteDoc(reviewRef);
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const prodRef = doc(db, "products", editingProd.id);
      const updatedData = {
        ...editingProd,
        stock: parseInt(editingProd.stock),
        price: editingProd.price.toString().startsWith("₹")
          ? editingProd.price
          : `₹${editingProd.price}`,
        originalPrice: editingProd.originalPrice
          ? editingProd.originalPrice.toString().startsWith("₹")
            ? editingProd.originalPrice
            : `₹${editingProd.originalPrice}`
          : "",
        sizes:
          typeof editingProd.sizes === "string"
            ? editingProd.sizes.split(",")
            : editingProd.sizes,
        details:
          typeof editingProd.details === "string"
            ? editingProd.details.split("\n")
            : editingProd.details,
      };
      await updateDoc(prodRef, updatedData);
      alert("Updated Successfully!");
      setEditingProd(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    await updateDoc(doc(db, "orders", orderId), { status: newStatus });
  };

  const handleUpdateHero = async (e) => {
    e.preventDefault();
    try {
      // This updates the 'hero' document in 'siteSettings' collection
      await updateDoc(doc(db, "siteSettings", "hero"), {
        bannerUrl: heroData.bannerUrl,
        mobileBannerUrl: heroData.mobileBannerUrl,
        tagline: heroData.tagline,
      });
      alert("Banner updated successfully!");
    } catch (err) {
      console.error("Error updating banner:", err);
      alert("Failed to update banner.");
    }
  };

  const filteredProducts = liveProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    if (!userData?.isAdmin) return;

    // 1. Correct Collection Name: 'contactSubmissions'
    // 2. Correct Order Field: 'timestamp' (matching ContactUs.jsx)
    const qSubmissions = query(
      collection(db, "contactSubmissions"),
      orderBy("timestamp", "desc"),
    );

    const unsubSubmissions = onSnapshot(
      qSubmissions,
      (snap) => {
        const fetchedSubmissions = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setSubmissions(fetchedSubmissions);
      },
      (error) => {
        console.error("Error fetching submissions:", error);
      },
    );

    return () => {
      unsubSubmissions();
      // ... include your other unsubs here
    };
  }, [userData]);

  const deleteSubmission = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteDoc(doc(db, "contactSubmissions", id));
        alert("Submission deleted.");
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Filter orders
  const activeOrders = allOrders.filter((o) => o.status !== "Cancelled");
  const cancelledOrders = allOrders.filter((o) => o.status === "Cancelled");

  const toggleRefundStatus = async (orderId, currentStatus) => {
    const newStatus = currentStatus === "Refunded" ? "Pending" : "Refunded";
    try {
      await updateDoc(doc(db, "orders", orderId), { refundStatus: newStatus });
      toast.success(`Refund status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating refund status:", err);
      toast.error("Failed to update refund status");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Vanokhi Command Center</h1>
        <div className="admin-tabs">
          <button
            className={activeTab === "inventory" ? "active" : ""}
            onClick={() => setActiveTab("inventory")}
          >
            <Package size={18} /> Inventory
          </button>
          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingCart size={18} /> Orders
          </button>
          <button
            className={activeTab === "content" ? "active" : ""}
            onClick={() => setActiveTab("content")}
          >
            <ImageIcon size={18} /> Site Content
          </button>
          <button
            className={activeTab === "social" ? "active" : ""}
            onClick={() => setActiveTab("social")}
          >
            <Instagram size={18} /> Social & Reviews
          </button>
          <button
            className={activeTab === "messages" ? "active" : ""}
            onClick={() => setActiveTab("messages")}
          >
            <Mail size={18} /> Messages
          </button>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === "inventory" && (
          <div className="admin-grid">
            <div className="admin-card glass-morph">
              <h2>
                <Layers /> New Collection
              </h2>
              <form onSubmit={handleCreateCollection}>
                <input
                  placeholder="Collection Title"
                  required
                  value={newColl.title}
                  onChange={(e) =>
                    setNewColl({ ...newColl, title: e.target.value })
                  }
                />
                <input
                  placeholder="Tagline"
                  required
                  value={newColl.tagline}
                  onChange={(e) =>
                    setNewColl({ ...newColl, tagline: e.target.value })
                  }
                />
                <input
                  placeholder="Cover Image URL"
                  required
                  value={newColl.img}
                  onChange={(e) =>
                    setNewColl({ ...newColl, img: e.target.value })
                  }
                />
                <button type="submit" className="admin-btn">
                  Create Collection
                </button>
              </form>
            </div>

            <div className="admin-card glass-morph">
              <h2>
                <Plus /> New Product
              </h2>
              <form onSubmit={handleAddProduct} className="admin-form-scroll">
                <select
                  required
                  onChange={(e) =>
                    setNewProd({ ...newProd, collectionId: e.target.value })
                  }
                >
                  <option value="">Select Collection</option>
                  {liveCollections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>

                <div className="form-row">
                  <input
                    placeholder="Product Name"
                    required
                    onChange={(e) =>
                      setNewProd({ ...newProd, name: e.target.value })
                    }
                  />
                  <input
                    placeholder="Price (Numeric)"
                    required
                    onChange={(e) =>
                      setNewProd({ ...newProd, price: e.target.value })
                    }
                  />
                </div>

                <div className="form-row">
                  <input
                    placeholder="Original Price (MRP) - Optional"
                    value={newProd.originalPrice}
                    onChange={(e) =>
                      setNewProd({
                        ...newProd,
                        originalPrice: e.target.value,
                      })
                    }
                  />
                </div>

                <input
                  placeholder="Main Thumbnail URL"
                  required
                  onChange={(e) =>
                    setNewProd({ ...newProd, img: e.target.value })
                  }
                />
                <input
                  placeholder="Stock"
                  type="number"
                  required
                  onChange={(e) =>
                    setNewProd({ ...newProd, stock: e.target.value })
                  }
                />

                <div className="gallery-section">
                  <label>Image Gallery (Normal & PNG Parallel Inputs)</label>
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="form-row"
                      style={{ marginBottom: "10px" }}
                    >
                      <input
                        placeholder={`Img ${i + 1} Normal URL`}
                        value={newProd.galleryNormal[i]}
                        onChange={(e) =>
                          handleGalleryChange("normal", i, e.target.value)
                        }
                      />
                      <input
                        placeholder={`Img ${i + 1} PNG URL`}
                        value={newProd.galleryPNG[i]}
                        onChange={(e) =>
                          handleGalleryChange("png", i, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>

                <textarea
                  placeholder="Overview (Short Summary)"
                  required
                  value={newProd.overview}
                  onChange={(e) =>
                    setNewProd({ ...newProd, overview: e.target.value })
                  }
                />

                <textarea
                  placeholder="Description"
                  required
                  onChange={(e) =>
                    setNewProd({ ...newProd, description: e.target.value })
                  }
                />
                <textarea
                  placeholder="Sizes"
                  defaultValue="XS,S,M,L,XL"
                  onChange={(e) =>
                    setNewProd({ ...newProd, sizes: e.target.value })
                  }
                />
                <textarea
                  placeholder="Colors"
                  defaultValue="#860204,#000000"
                  onChange={(e) =>
                    setNewProd({ ...newProd, colors: e.target.value })
                  }
                />

                <div className="form-row">
                  <textarea
                    placeholder="Shipping Info"
                    onChange={(e) =>
                      setNewProd({ ...newProd, shippingInfo: e.target.value })
                    }
                  />
                  <textarea
                    placeholder="Return Policy"
                    onChange={(e) =>
                      setNewProd({ ...newProd, returnPolicy: e.target.value })
                    }
                  />
                </div>
                <button type="submit" className="admin-btn publish">
                  Publish Product
                </button>
              </form>
            </div>

            <div className="admin-card manage-card glass-morph full-width">
              <h2>
                <Package /> Inventory Manager
              </h2>
              <div className="search-bar">
                <Search size={18} />
                <input
                  placeholder="Search Luxe products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="product-list-mini">
                {loading
                  ? [...Array(5)].map((_, i) => (
                    <div key={i} className="mini-item">
                      <Skeleton
                        type="block"
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "10px",
                          marginRight: "20px",
                        }}
                      />
                      <div className="item-info">
                        <Skeleton type="text" style={{ width: "120px" }} />
                        <Skeleton
                          type="text"
                          style={{ width: "80px", height: "12px" }}
                        />
                      </div>
                    </div>
                  ))
                  : filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      className={`mini-item ${p.stock < 5 ? "low-stock-alert" : ""
                        }`}
                    >
                      <img src={p.img} alt="" />
                      <div className="item-info">
                        <span>{p.name}</span>
                        <small>
                          {p.price} — Stock: {p.stock}
                        </small>
                      </div>
                      <div className="item-actions">
                        <button
                          className={`most-wanted-toggle ${mostWantedIds.includes(p.id) ? "active" : ""
                            }`}
                          onClick={() => toggleMostWanted(p.id)}
                          title="Toggle Most Wanted"
                        >
                          <Star
                            size={16}
                            fill={
                              mostWantedIds.includes(p.id) ? "#dd8512" : "none"
                            }
                          />
                        </button>

                        <button
                          onClick={() =>
                            setEditingProd({
                              ...p,
                              sizes: p.sizes?.join(","),
                              details: p.details?.join("\n"),
                              price: p.price.replace("₹", ""),
                              originalPrice: p.originalPrice
                                ? p.originalPrice.replace("₹", "")
                                : "",
                            })
                          }
                          className="edit-icon"
                        >
                          <Edit3 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <>
            <div className="admin-orders-container">
              {/* Active Orders Section */}
              <div className="admin-card full-width">
                <h2>
                  <ShoppingCart /> Customer Orders ({activeOrders.length})
                </h2>
                <div className="admin-orders-list">
                  {loading
                    ? [...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="admin-order-item"
                        style={{ padding: "20px" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "15px",
                          }}
                        >
                          <div>
                            <Skeleton
                              type="text"
                              style={{ width: "80px", marginBottom: "10px" }}
                            />
                            <Skeleton
                              type="text"
                              style={{ width: "150px", height: "24px" }}
                            />
                            <Skeleton
                              type="text"
                              style={{ width: "200px", marginTop: "10px" }}
                            />
                          </div>
                          <div>
                            <Skeleton
                              type="rect"
                              style={{
                                width: "100px",
                                height: "30px",
                                borderRadius: "20px",
                              }}
                            />
                          </div>
                        </div>
                        <Skeleton type="block" style={{ height: "60px" }} />
                      </div>
                    ))
                    : activeOrders.map((order) => (
                      <div key={order.id} className="admin-order-item">
                        {/* Existing Order Item Content */}
                        <div className="order-main-info">
                          <div className="order-customer">
                            <span className="order-id">
                              #{order.orderNumber.toUpperCase()}
                            </span>
                            <h4>
                              {order.customerName || order.userName || "Anonymous"}
                            </h4>
                            <p className="order-email">{order.email}</p>
                            <div className="shipping-info-box">
                              <p>
                                <strong>Phone:</strong> {order.phone}
                              </p>
                              <p>
                                <strong>Address:</strong> {order.shippingAddress}
                              </p>
                            </div>
                          </div>
                          <div className="order-summary">
                            <div className="payment-status-badge">
                              <span
                                className={`badge ${order.paymentMode === "COD"
                                  ? "badge-gold"
                                  : "badge-blue"
                                  }`}
                              >
                                {order.paymentMode}
                              </span>
                              <span
                                className={`status-pill ${order.paymentStatus?.toLowerCase()}`}
                              >
                                {order.paymentStatus}
                              </span>
                            </div>

                            <p>Items: {order.items?.length || 0}</p>
                            <p className="order-total-price">
                              ₹{order.totalAmount || order.total}
                            </p>

                            {/* Payment Update Button for Admin */}
                            {order.paymentMode === "COD" &&
                              order.paymentStatus !== "Paid" && (
                                <button
                                  className="admin-btn admin-btn-payment"
                                  onClick={() =>
                                    updateDoc(doc(db, "orders", order.id), {
                                      paymentStatus: "Paid",
                                    })
                                  }
                                >
                                  <Check size={14} />
                                  <span>Mark as Paid</span>
                                </button>
                              )}
                          </div>
                        </div>

                        <div className="status-management">
                          <p className="status-label">Update Shipment Progress:</p>
                          <div className="status-buttons">
                            {[
                              { label: "Order Placed", icon: <Box size={14} /> },
                              { label: "Shipped", icon: <Truck size={14} /> },
                              {
                                label: "Out for Delivery",
                                icon: <Truck size={14} />,
                              },
                              {
                                label: "Delivered",
                                icon: <CheckCircle size={14} />,
                              },
                            ].map((status) => (
                              <button
                                key={status.label}
                                className={`status-btn ${order.status === status.label ? "btn-active" : ""
                                  }`}
                                onClick={() => updateStatus(order.id, status.label)}
                              >
                                {status.icon} {status.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Cancelled Orders Section */}
              {cancelledOrders.length > 0 && (
                <div className="admin-card full-width cancelled-orders-section">
                  <h2>
                    <X className="text-red-600" /> Cancelled Orders ({cancelledOrders.length})
                  </h2>
                  <div className="admin-orders-list">
                    {cancelledOrders.map((order) => (
                      <div key={order.id} className="admin-order-item cancelled-order-card">
                        <div className="order-main-info">
                          <div className="order-customer">
                            <span className="order-id">
                              #{order.orderNumber.toUpperCase()}
                            </span>
                            <h4>
                              {order.customerName || order.userName || "Anonymous"}
                            </h4>
                            <p className="order-email">{order.email}</p>
                            <div className="cancelled-meta">
                              <div className="meta-row">
                                <span className="meta-label">Cancelled At:</span>
                                <span className="meta-value">
                                  {order.cancelledAt?.toDate().toLocaleString()}
                                </span>
                              </div>
                              <div className="meta-row">
                                <span className="meta-label">Payment ID:</span>
                                <span className="meta-value">
                                  {order.paymentId || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="order-summary">
                            <div className="payment-status-badge">
                              <span className="badge badge-red">Cancelled</span>
                              <span className="badge badge-blue">
                                {order.paymentMode}
                              </span>
                            </div>

                            <p className="order-total-price">
                              ₹{order.totalAmount || order.total}
                            </p>

                            {/* Refund Toggle */}
                            <div className="refund-control">
                              <span className="refund-label">Refund Status:</span>
                              <button
                                className={`status-pill ${order.refundStatus === "Refunded"
                                  ? "approved"
                                  : "pending"
                                  }`}
                                onClick={() =>
                                  toggleRefundStatus(
                                    order.id,
                                    order.refundStatus || "Pending",
                                  )
                                }
                              >
                                {order.refundStatus || "Pending"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div
              className="admin-card glass-morph full-width"
              style={{ marginTop: "2rem" }}
            >
              <h2>
                <AlertTriangle
                  size={20}
                  style={{ marginRight: "10px", color: "var(--primary)" }}
                />
                Pending Returns & Exchanges ({requests.length})
              </h2>
              <div className="admin-table-wrapper">
                <table className="admin-table-custom">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Type</th>
                      <th>Reason</th>
                      <th>Current Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          style={{
                            textAlign: "center",
                            padding: "2rem",
                            color: "#999",
                          }}
                        >
                          No pending return or exchange requests.
                        </td>
                      </tr>
                    ) : (
                      requests.map((req) => (
                        <tr key={req.id}>
                          <td className="bold-text">#{req.orderNumber}</td>
                          <td>
                            <span
                              className={`badge ${req.type === "Return"
                                ? "badge-red"
                                : "badge-gold"
                                }`}
                            >
                              {req.type}
                            </span>
                          </td>
                          <td className="reason-cell">{req.reason}</td>
                          <td>
                            <span
                              className={`status-pill ${req.status.toLowerCase()}`}
                            >
                              {req.status}
                            </span>
                          </td>
                          <td className="action-buttons-cell">
                            <button
                              className="status-btn approve"
                              onClick={() =>
                                handleUpdateStatus(req.id, "Approved")
                              }
                            >
                              <Check size={14} /> Approve
                            </button>
                            <button
                              className="status-btn reject"
                              onClick={() =>
                                handleUpdateStatus(req.id, "Rejected")
                              }
                            >
                              <Ban size={14} /> Reject
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Edit Modal */}
        {editingProd && (
          <div className="edit-overlay">
            <div className="edit-modal admin-card">
              <div className="modal-header">
                <h3>Edit Product</h3>
                <button
                  onClick={() => setEditingProd(null)}
                  className="close-btn"
                >
                  <X />
                </button>
              </div>
              <form onSubmit={handleUpdateProduct}>
                <input
                  value={editingProd.name}
                  onChange={(e) =>
                    setEditingProd({ ...editingProd, name: e.target.value })
                  }
                />
                <input
                  value={editingProd.price}
                  onChange={(e) =>
                    setEditingProd({ ...editingProd, price: e.target.value })
                  }
                />
                <input
                  value={editingProd.img}
                  onChange={(e) =>
                    setEditingProd({ ...editingProd, img: e.target.value })
                  }
                />
                <textarea
                  value={editingProd.description}
                  onChange={(e) =>
                    setEditingProd({
                      ...editingProd,
                      description: e.target.value,
                    })
                  }
                />
                <button type="submit" className="admin-btn">
                  <Save size={18} /> Update
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="admin-grid">
            <div className="admin-card glass-morph full-width">
              <h2>
                <Star /> Landing Page Hero
              </h2>
              <form onSubmit={handleUpdateHero}>
                <div className="form-group">
                  <label>Desktop Banner URL</label>
                  <input
                    type="text"
                    placeholder="Image URL for large screens"
                    value={heroData.bannerUrl}
                    onChange={(e) =>
                      setHeroData({ ...heroData, bannerUrl: e.target.value })
                    }
                  />
                </div>

                {/* NEW MOBILE INPUT FIELD */}
                <div className="form-group">
                  <label>Mobile Banner URL (Vertical/Small screens)</label>
                  <input
                    type="text"
                    placeholder="Image URL for mobile screens"
                    value={heroData.mobileBannerUrl}
                    onChange={(e) =>
                      setHeroData({
                        ...heroData,
                        mobileBannerUrl: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Tagline</label>
                  <input
                    type="text"
                    placeholder="Vanokhi Tagline"
                    value={heroData.tagline}
                    onChange={(e) =>
                      setHeroData({ ...heroData, tagline: e.target.value })
                    }
                  />
                </div>
                <button type="submit" className="admin-btn update">
                  <Save size={18} /> Save Banner Settings
                </button>
              </form>
            </div>

            <div className="admin-card glass-morph full-width">
              <h2>
                <ImageIcon size={20} /> New Arrivals Poster
              </h2>
              <form onSubmit={updateNewArrivalPoster}>
                <div className="form-row">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      flex: 1,
                    }}
                  >
                    <label style={{ fontSize: "0.8rem", fontWeight: "bold" }}>
                      Poster Image URL (16:9 Aspect Ratio)
                    </label>
                    <input
                      placeholder="https://..."
                      value={newArrivalPoster}
                      onChange={(e) => setNewArrivalPoster(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="admin-btn publish"
                  style={{ marginTop: "10px" }}
                >
                  <Save size={18} /> Update New Arrivals Poster
                </button>
              </form>
            </div>

            <div className="admin-card glass-morph full-width">
              <h2>Brand Story Images</h2>
              <form onSubmit={updateStoryContent}>
                <div className="form-row">
                  <input
                    placeholder="Left Image URL"
                    value={storyImages.img1}
                    onChange={(e) =>
                      setStoryImages({ ...storyImages, img1: e.target.value })
                    }
                  />
                  <input
                    placeholder="Right Image URL"
                    value={storyImages.img2}
                    onChange={(e) =>
                      setStoryImages({ ...storyImages, img2: e.target.value })
                    }
                  />
                </div>
                <button type="submit" className="admin-btn publish">
                  Update Story Images
                </button>
              </form>
            </div>

            {/* Preview Section */}
            <div
              className="admin-card glass-morph full-width"
              style={{ opacity: 0.8 }}
            >
              <h2 style={{ fontSize: "0.9rem" }}>Live Preview</h2>
              <div
                style={{
                  width: "100%",
                  height: "200px",
                  backgroundImage: `url(${heroData.bannerUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                }}
              >
                <h1 style={{ fontFamily: "Bodoni Moda" }}>
                  {heroData.tagline}
                </h1>
              </div>
            </div>

            <div
              className="admin-card glass-morph full-width"
              style={{ opacity: 0.8 }}
            >
              <h2 style={{ fontSize: "0.9rem" }}>
                New Arrivals Preview (16:9)
              </h2>
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9", // Maintains 16:9 ratio in preview
                  backgroundImage: `url(${newArrivalPoster})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                {!newArrivalPoster && (
                  <span style={{ color: "#999" }}>No image URL provided</span>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="admin-grid">
            {/* Instagram Manager */}
            <div className="admin-card glass-morph">
              <h2>
                <Instagram />{" "}
                {editingInsta ? "Edit Post" : "Add Instagram Post"}
              </h2>
              <form
                onSubmit={editingInsta ? handleUpdateInsta : handleAddInsta}
              >
                <input
                  placeholder="Image URL"
                  value={editingInsta ? editingInsta.img : newInsta.img}
                  onChange={(e) =>
                    editingInsta
                      ? setEditingInsta({
                        ...editingInsta,
                        img: e.target.value,
                      })
                      : setNewInsta({ ...newInsta, img: e.target.value })
                  }
                />
                <input
                  placeholder="Instagram Link"
                  value={
                    editingInsta ? editingInsta.instalink : newInsta.instalink
                  }
                  onChange={(e) =>
                    editingInsta
                      ? setEditingInsta({
                        ...editingInsta,
                        instalink: e.target.value,
                      })
                      : setNewInsta({ ...newInsta, instalink: e.target.value })
                  }
                />
                <div className="form-row">
                  <input
                    type="number"
                    placeholder="Likes"
                    value={editingInsta ? editingInsta.likes : newInsta.likes}
                    onChange={(e) =>
                      editingInsta
                        ? setEditingInsta({
                          ...editingInsta,
                          likes: e.target.value,
                        })
                        : setNewInsta({ ...newInsta, likes: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Comments"
                    value={
                      editingInsta ? editingInsta.comments : newInsta.comments
                    }
                    onChange={(e) =>
                      editingInsta
                        ? setEditingInsta({
                          ...editingInsta,
                          comments: e.target.value,
                        })
                        : setNewInsta({ ...newInsta, comments: e.target.value })
                    }
                  />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="submit"
                    className="admin-btn publish"
                    style={{ flex: 1 }}
                  >
                    {editingInsta ? "Update Post" : "Add to Grid"}
                  </button>
                  {editingInsta && (
                    <button
                      onClick={() => setEditingInsta(null)}
                      className="admin-btn"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <div className="product-list-mini" style={{ marginTop: "20px" }}>
                {instaPosts.map((post) => (
                  <div key={post.id} className="mini-item">
                    <img src={post.img} alt="" />
                    <div className="item-info">
                      <span>{post.likes} Likes</span>
                      <small>{post.instalink.slice(0, 30)}...</small>
                    </div>
                    <div className="item-actions">
                      <button
                        onClick={() => setEditingInsta(post)}
                        className="edit-icon"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => deleteInsta(post.id)}
                        className="edit-icon"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Moderation */}
            <div className="admin-card glass-morph">
              <h2>
                <MessageSquare /> Global Review Moderation
              </h2>
              <div className="product-list-mini" style={{ maxHeight: "600px" }}>
                {allReviews.map((review) => (
                  <div
                    key={review.id}
                    className="mini-item"
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <strong>{review.userName}</strong>
                      <button
                        onClick={() =>
                          deleteReview(review.productId, review.id)
                        } // Uses the productId we mapped above
                        className="delete-btn"
                        style={{
                          color: "#860204",
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                        }}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        color: "#ffc107",
                        margin: "5px 0",
                      }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < review.rating ? "#ffc107" : "none"}
                        />
                      ))}
                    </div>
                    <p style={{ fontSize: "0.85rem", margin: "5px 0" }}>
                      {review.comment}
                    </p>
                    <small style={{ color: "#999" }}>
                      Product ID: {review.productId}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="admin-messages-container">
            {submissions.length === 0 ? (
              <p className="no-data">No contact submissions yet.</p>
            ) : (
              <div className="submissions-grid">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="admin-card glass-morph submission-card"
                  >
                    <div className="submission-header">
                      <div>
                        <h3>{sub.name}</h3>
                        <span className="sub-email">{sub.email}</span>
                      </div>
                      <button
                        onClick={() => deleteSubmission(sub.id)}
                        className="delete-icon-btn"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="submission-body">
                      {/* Using optional chaining for safety */}
                      <p className="sub-msg">{sub.message}</p>
                    </div>
                    <div className="submission-footer">
                      <small>
                        {sub.timestamp?.toDate
                          ? sub.timestamp.toDate().toLocaleString()
                          : "Date unavailable"}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {
        editingProd && (
          <div className="edit-overlay">
            <div className="admin-card edit-modal glass-morph">
              <div className="modal-header">
                <h2>
                  <Edit3 /> Edit: {editingProd.name}
                </h2>
                <button
                  onClick={() => setEditingProd(null)}
                  className="close-btn"
                >
                  <X />
                </button>
              </div>
              <form onSubmit={handleUpdateProduct} className="edit-form-scroll">
                <div className="form-row">
                  <input
                    value={editingProd.name}
                    onChange={(e) =>
                      setEditingProd({ ...editingProd, name: e.target.value })
                    }
                  />
                  <input
                    value={editingProd.price}
                    onChange={(e) =>
                      setEditingProd({ ...editingProd, price: e.target.value })
                    }
                  />
                  <input
                    placeholder="Original Price (MRP)"
                    value={editingProd.originalPrice || ""}
                    onChange={(e) =>
                      setEditingProd({
                        ...editingProd,
                        originalPrice: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-row">
                  <input
                    type="number"
                    value={editingProd.stock}
                    onChange={(e) =>
                      setEditingProd({ ...editingProd, stock: e.target.value })
                    }
                  />
                  <input
                    value={editingProd.img}
                    onChange={(e) =>
                      setEditingProd({ ...editingProd, img: e.target.value })
                    }
                  />
                </div>

                <label>Gallery Normal (Comma Separated)</label>
                <textarea
                  value={editingProd.galleryNormal?.join(",")}
                  onChange={(e) =>
                    setEditingProd({
                      ...editingProd,
                      galleryNormal: e.target.value.split(","),
                    })
                  }
                />

                <label>Gallery PNG (Comma Separated)</label>
                <textarea
                  value={editingProd.galleryPNG?.join(",")}
                  onChange={(e) =>
                    setEditingProd({
                      ...editingProd,
                      galleryPNG: e.target.value.split(","),
                    })
                  }
                />

                <button type="submit" className="admin-btn update">
                  <Save size={18} /> Update Product
                </button>
              </form>
            </div>
          </div>
        )
      }
    </div >
  );
}
