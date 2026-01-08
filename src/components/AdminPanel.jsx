// src/components/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  query,
  orderBy,
  getDoc,
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
} from "lucide-react";
import "./AdminPanel.css";

export default function AdminPanel() {
  const { userData, liveProducts, liveCollections } = useAuth();
  const [activeTab, setActiveTab] = useState("inventory");

  // --- STATE: INVENTORY ---
  const [newColl, setNewColl] = useState({ title: "", tagline: "", img: "" });
  const [newProd, setNewProd] = useState({
    name: "",
    price: "",
    img: "",
    collectionId: "",
    stock: 0,
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
  const [editingProd, setEditingProd] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
      await addDoc(collection(db, "products"), {
        ...newProd,
        price: `₹${newProd.price}`,
        sizes: newProd.sizes.split(","),
        colors: newProd.colors.split(","),
        details: newProd.details.split("\n"),
        stock: parseInt(newProd.stock),
        galleryNormal: newProd.galleryNormal,
        galleryPNG: newProd.galleryPNG,
      });
      alert("Product Published!");
    } catch (err) {
      alert(err.message);
    }
  };

  // --- STATE: ORDERS ---
  const [orders, setOrders] = useState([]);

  // --- STATE: SITE CONTENT ---
  const [heroData, setHeroData] = useState({ bannerUrl: "", tagline: "" });

  useEffect(() => {
    if (!userData?.isAdmin) return;

    const qOrders = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
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

    return () => unsubOrders();
  }, [userData]);

  if (!userData?.isAdmin)
    return <div className="admin-denied">Admin Access Required.</div>;

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "collections"), { ...newColl, productIds: [] });
    alert("Collection Created!");
    setNewColl({ title: "", subtitle: "", img: "" });
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

  const updateHero = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "siteSettings", "hero"), heroData);
    alert("Landing Page Banner Updated!");
  };

  const filteredProducts = liveProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className={`mini-item ${
                      p.stock < 5 ? "low-stock-alert" : ""
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
                        onClick={() =>
                          setEditingProd({
                            ...p,
                            sizes: p.sizes?.join(","),
                            details: p.details?.join("\n"),
                            price: p.price.replace("₹", ""),
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
          <div className="admin-orders-list">
            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="admin-card order-card glass-morph"
                >
                  <div className="order-header">
                    <div>
                      <strong>Order #{order.id.slice(-6)}</strong>
                      <p>{order.customerName}</p>
                    </div>
                    <select
                      className={`status-select ${order.status}`}
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                  <div className="order-details">
                    <small>
                      {order.items?.length} items — Total: {order.total}
                    </small>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "content" && (
          <div className="admin-grid">
            <div className="admin-card glass-morph full-width">
              <h2>
                <Star /> Landing Page Hero
              </h2>
              <form onSubmit={updateHero}>
                <div className="form-row">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <label style={{ fontSize: "0.8rem", fontWeight: "bold" }}>
                      Banner Image URL
                    </label>
                    <input
                      placeholder="https://..."
                      value={heroData.bannerUrl}
                      onChange={(e) =>
                        setHeroData({ ...heroData, bannerUrl: e.target.value })
                      }
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <label style={{ fontSize: "0.8rem", fontWeight: "bold" }}>
                      Main Tagline
                    </label>
                    <input
                      placeholder="Elevate Your Style"
                      value={heroData.tagline}
                      onChange={(e) =>
                        setHeroData({ ...heroData, tagline: e.target.value })
                      }
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="admin-btn publish"
                  style={{ marginTop: "10px" }}
                >
                  <Save size={18} /> Update Hero Section
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
          </div>
        )}
      </div>

      {editingProd && (
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
      )}
    </div>
  );
}
