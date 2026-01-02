import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Trash2, Plus, Edit3, Package } from "lucide-react";
import "./AdminPanel.css";

export default function AdminPanel() {
  const { userData, liveProducts } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    img: "",
    category: "",
    description: "",
    stock: 0,
    sizes: "S,M,L,XL",
    colors: "#860204,#000000",
  });

  if (!userData?.isAdmin)
    return (
      <div className="admin-denied">Access Restricted to Administrators.</div>
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "products"), {
        ...formData,
        price: `₹${formData.price}`,
        sizes: formData.sizes.split(","),
        colors: formData.colors.split(","),
        stock: parseInt(formData.stock),
        details: [formData.description.substring(0, 30)], // Default detail
        gallery: [formData.img], // Default gallery
      });
      alert("Product Published!");
    } catch (err) {
      alert(err.message);
    }
  };

  const updateStock = async (id, delta) => {
    const prod = liveProducts.find((p) => p.id === id);
    await updateDoc(doc(db, "products", id), {
      stock: (prod.stock || 0) + delta,
    });
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>
          <Package /> Inventory Control
        </h1>
      </header>

      <div className="admin-grid">
        {/* ADD PRODUCT FORM */}
        <form className="admin-form-card" onSubmit={handleSubmit}>
          <h3>Add New Item</h3>
          <input
            placeholder="Product Name"
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            placeholder="Price (Numeric only: 1499)"
            required
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
          <input
            placeholder="Category (e.g. Corsets)"
            required
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />
          <input
            placeholder="Main Image URL"
            required
            onChange={(e) => setFormData({ ...formData, img: e.target.value })}
          />
          <input
            placeholder="Stock Amount"
            type="number"
            required
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
          />
          <textarea
            placeholder="Full Description"
            required
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <button type="submit">
            <Plus size={18} /> Publish to Store
          </button>
        </form>

        {/* LIVE LIST */}
        <div className="admin-inventory-list">
          <h3>Manage Live Products ({liveProducts.length})</h3>
          {liveProducts.map((p) => (
            <div key={p.id} className="inventory-item">
              <img src={p.img} alt="" />
              <div className="item-details">
                <h4>{p.name}</h4>
                <p>
                  {p.category} | {p.price}
                </p>
                <div className="stock-ctrl">
                  <span>Stock: {p.stock}</span>
                  <button onClick={() => updateStock(p.id, 1)}>+</button>
                  <button onClick={() => updateStock(p.id, -1)}>-</button>
                </div>
              </div>
              <button
                className="del-btn"
                onClick={() => deleteDoc(doc(db, "products", p.id))}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
