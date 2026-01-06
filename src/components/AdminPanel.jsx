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
  const [newColl, setNewColl] = useState({ title: "", subtitle: "", img: "" });
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
  });
  const [editingProd, setEditingProd] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- STATE: ORDERS ---
  const [orders, setOrders] = useState([]);

  // --- STATE: REVIEWS ---
  const [allReviews, setAllReviews] = useState([]);

  // --- STATE: SITE CONTENT ---
  const [heroData, setHeroData] = useState({ bannerUrl: "", tagline: "" });

  useEffect(() => {
    if (!userData?.isAdmin) return;

    // Fetch Orders
    const qOrders = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );
    const unsubOrders = onSnapshot(qOrders, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    // Fetch Hero Settings
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

  // --- HANDLERS: INVENTORY ---
  const handleCreateCollection = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "collections"), { ...newColl, productIds: [] });
    alert("Collection Created!");
    setNewColl({ title: "", subtitle: "", img: "" });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const prodRef = await addDoc(collection(db, "products"), {
        ...newProd,
        price: `₹${newProd.price}`,
        sizes: newProd.sizes.split(","),
        colors: newProd.colors.split(","),
        details: newProd.details.split("\n"),
        stock: parseInt(newProd.stock),
        gallery: [newProd.img],
      });
      const collRef = doc(db, "collections", newProd.collectionId);
      await updateDoc(collRef, { productIds: arrayUnion(prodRef.id) });
      alert("Product Published!");
    } catch (err) {
      alert(err.message);
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

  // --- HANDLERS: ORDERS & SITE ---
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
            {/* NEW COLLECTION */}
            <div className="admin-card glass-morph">
              <h2>
                <Layers /> New Collection
              </h2>
              <form onSubmit={handleCreateCollection}>
                <input
                  placeholder="Title"
                  required
                  value={newColl.title}
                  onChange={(e) =>
                    setNewColl({ ...newColl, title: e.target.value })
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
                  Create
                </button>
              </form>
            </div>

            {/* NEW PRODUCT */}
            <div className="admin-card glass-morph">
          <h2>
            <Plus /> New Product
          </h2>
          <form onSubmit={handleAddProduct}>
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
            <input
              placeholder="Product Name"
              required
              onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
            />
            <input
              placeholder="Price (Numeric: 1395)"
              required
              onChange={(e) =>
                setNewProd({ ...newProd, price: e.target.value })
              }
            />
            <input
              placeholder="Main Image URL"
              required
              onChange={(e) => setNewProd({ ...newProd, img: e.target.value })}
            />
            <input
              placeholder="Stock"
              type="number"
              required
              onChange={(e) =>
                setNewProd({ ...newProd, stock: e.target.value })
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
              placeholder="Sizes (comma separated)"
              defaultValue="XS,S,M,L,XL"
              onChange={(e) =>
                setNewProd({ ...newProd, sizes: e.target.value })
              }
            />
            <textarea
              placeholder="Colors (comma separated hex)"
              defaultValue="#860204,#000000,#ffffff"
              onChange={(e) =>
                setNewProd({ ...newProd, colors: e.target.value })
              }
            />
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
            <textarea
              placeholder="Manufacturing"
              onChange={(e) =>
                setNewProd({ ...newProd, manufacturing: e.target.value })
              }
            />
            <textarea
              placeholder="Details (one per line)"
              onChange={(e) =>
                setNewProd({ ...newProd, details: e.target.value })
              }
            />
            <button type="submit" className="admin-btn publish">
              Publish Product
            </button>
          </form>
        </div>

            {/* INVENTORY MANAGER */}
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
                        {p.price} — Stock: {p.stock}{" "}
                        {p.stock < 5 && <b className="stock-tag">LOW STOCK</b>}
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
            {orders.map((order) => (
              <div key={order.id} className="order-card glass-morph">
                <div className="order-header">
                  <h3>Order #{order.id.slice(-6)}</h3>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                    className={`status-select ${order.status}`}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div className="order-details">
                  <p>
                    <b>Customer:</b> {order.customerName} ({order.email})
                  </p>
                  <p>
                    <b>Total:</b> ₹{order.total}
                  </p>
                  <div className="order-items">
                    {order.items?.map((item, i) => (
                      <span key={i}>
                        {item.name} ({item.size}) x{item.qty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "content" && (
          <div className="admin-card glass-morph">
            <h2>
              <ImageIcon /> Landing Page Hero
            </h2>
            <form onSubmit={updateHero}>
              <label>Hero Banner URL</label>
              <input
                value={heroData.bannerUrl}
                onChange={(e) =>
                  setHeroData({ ...heroData, bannerUrl: e.target.value })
                }
              />
              <label>Hero Tagline</label>
              <input
                value={heroData.tagline}
                onChange={(e) =>
                  setHeroData({ ...heroData, tagline: e.target.value })
                }
              />
              <button type="submit" className="admin-btn publish">
                Update Landing Page
              </button>
            </form>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
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
                <div className="input-group">
                  <label>Name</label>
                  <input
                    value={editingProd.name}
                    onChange={(e) =>
                      setEditingProd({ ...editingProd, name: e.target.value })
                    }
                  />
                </div>
                <div className="input-group">
                  <label>Price</label>
                  <input
                    value={editingProd.price}
                    onChange={(e) =>
                      setEditingProd({ ...editingProd, price: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    value={editingProd.stock}
                    onChange={(e) =>
                      setEditingProd({ ...editingProd, stock: e.target.value })
                    }
                  />
                </div>
                <div className="input-group">
                  <label>Image URL</label>
                  <input
                    value={editingProd.img}
                    onChange={(e) =>
                      setEditingProd({ ...editingProd, img: e.target.value })
                    }
                  />
                </div>
              </div>
              <label>Description</label>
              <textarea
                value={editingProd.description}
                onChange={(e) =>
                  setEditingProd({
                    ...editingProd,
                    description: e.target.value,
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
