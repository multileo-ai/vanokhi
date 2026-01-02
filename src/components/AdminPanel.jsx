// src/components/AdminPanel.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { Plus, Trash2, Package, Layers } from "lucide-react";
import "./AdminPanel.css";

export default function AdminPanel() {
  const { userData, liveProducts, liveCollections } = useAuth();

  // State for new Collection
  const [newColl, setNewColl] = useState({ title: "", subtitle: "", img: "" });

  // State for new Product
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

  if (!userData?.isAdmin)
    return <div className="admin-denied">Admin Access Required.</div>;

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "collections"), { ...newColl, productIds: [] });
    alert("Collection Created!");
    setNewColl({ title: "", subtitle: "", img: "" });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      // 1. Add Product to 'products' collection
      const prodRef = await addDoc(collection(db, "products"), {
        ...newProd,
        price: `₹${newProd.price}`,
        sizes: newProd.sizes.split(","),
        colors: newProd.colors.split(","),
        details: newProd.details.split("\n"),
        stock: parseInt(newProd.stock),
        gallery: [newProd.img],
      });

      // 2. Link Product to the selected Collection
      const collRef = doc(db, "collections", newProd.collectionId);
      await updateDoc(collRef, {
        productIds: arrayUnion(prodRef.id),
      });

      alert("Product Published and Added to Collection!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Portal</h1>

      <div className="admin-grid">
        {/* SECTION 1: CREATE COLLECTION */}
        <div className="admin-card">
          <h2>
            <Layers /> New Collection
          </h2>
          <form onSubmit={handleCreateCollection}>
            <input
              placeholder="Title (e.g. VELVET NIGHTS)"
              required
              value={newColl.title}
              onChange={(e) =>
                setNewColl({ ...newColl, title: e.target.value })
              }
            />
            <input
              placeholder="Subtitle"
              value={newColl.subtitle}
              onChange={(e) =>
                setNewColl({ ...newColl, subtitle: e.target.value })
              }
            />
            <input
              placeholder="Cover Image URL"
              required
              value={newColl.img}
              onChange={(e) => setNewColl({ ...newColl, img: e.target.value })}
            />
            <button type="submit" className="admin-btn">
              Create Collection
            </button>
          </form>
        </div>

        {/* SECTION 2: ADD PRODUCT */}
        <div className="admin-card">
          <h2>
            <Package /> New Product
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
      </div>
    </div>
  );
}
