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
import {
  Plus,
  Trash2,
  Package,
  Layers,
  Edit3,
  Save,
  X,
  Search,
} from "lucide-react";
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

  // State for Editing
  const [editingProd, setEditingProd] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

      // Prepare data similarly to Add Product logic
      const updatedData = {
        ...editingProd,
        stock: parseInt(editingProd.stock),
        // Format price if numeric string is provided
        price: editingProd.price.toString().startsWith("₹")
          ? editingProd.price
          : `₹${editingProd.price}`,
        // Handle array fields if they were edited as strings
        sizes:
          typeof editingProd.sizes === "string"
            ? editingProd.sizes.split(",")
            : editingProd.sizes,
        colors:
          typeof editingProd.colors === "string"
            ? editingProd.colors.split(",")
            : editingProd.colors,
        details:
          typeof editingProd.details === "string"
            ? editingProd.details.split("\n")
            : editingProd.details,
      };

      await updateDoc(prodRef, updatedData);
      alert("Product Updated Successfully!");
      setEditingProd(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "products", id));
      alert("Product Deleted");
    }
  };

  const filteredProducts = liveProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Portal</h1>
        <p>Manage your luxury collections and inventory</p>
      </div>

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

        {/* SECTION 3: INVENTORY MANAGER */}
        <div className="admin-card manage-card glass-morph">
          <h2>
            <Package /> Inventory Manager
          </h2>
          <div className="search-bar">
            <Search size={18} />
            <input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="product-list-mini">
            {filteredProducts.map((p) => (
              <div key={p.id} className="mini-item">
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
                        // Convert arrays back to strings for easy textarea editing
                        sizes: p.sizes?.join(","),
                        colors: p.colors?.join(","),
                        details: p.details?.join("\n"),
                        price: p.price.replace("₹", ""), // edit as number
                      })
                    }
                    className="edit-icon"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="delete-icon"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FULL PRODUCT EDIT MODAL */}
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
                    <label>Product Name</label>
                    <input
                      value={editingProd.name}
                      onChange={(e) =>
                        setEditingProd({ ...editingProd, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="input-group">
                    <label>Price (Numeric)</label>
                    <input
                      value={editingProd.price}
                      onChange={(e) =>
                        setEditingProd({
                          ...editingProd,
                          price: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label>Image URL</label>
                    <input
                      value={editingProd.img}
                      onChange={(e) =>
                        setEditingProd({ ...editingProd, img: e.target.value })
                      }
                    />
                  </div>
                  <div className="input-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      value={editingProd.stock}
                      onChange={(e) =>
                        setEditingProd({
                          ...editingProd,
                          stock: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <label>Description</label>
                <textarea
                  rows="3"
                  value={editingProd.description}
                  onChange={(e) =>
                    setEditingProd({
                      ...editingProd,
                      description: e.target.value,
                    })
                  }
                />

                <div className="form-row">
                  <div className="input-group">
                    <label>Sizes (comma separated)</label>
                    <input
                      value={editingProd.sizes}
                      onChange={(e) =>
                        setEditingProd({
                          ...editingProd,
                          sizes: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="input-group">
                    <label>Colors (comma hex)</label>
                    <input
                      value={editingProd.colors}
                      onChange={(e) =>
                        setEditingProd({
                          ...editingProd,
                          colors: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <label>Shipping Info</label>
                <textarea
                  rows="2"
                  value={editingProd.shippingInfo}
                  onChange={(e) =>
                    setEditingProd({
                      ...editingProd,
                      shippingInfo: e.target.value,
                    })
                  }
                />

                <label>Return Policy</label>
                <textarea
                  rows="2"
                  value={editingProd.returnPolicy}
                  onChange={(e) =>
                    setEditingProd({
                      ...editingProd,
                      returnPolicy: e.target.value,
                    })
                  }
                />

                <label>Manufacturing Details</label>
                <textarea
                  rows="2"
                  value={editingProd.manufacturing}
                  onChange={(e) =>
                    setEditingProd({
                      ...editingProd,
                      manufacturing: e.target.value,
                    })
                  }
                />

                <label>Bullet Details (one per line)</label>
                <textarea
                  rows="4"
                  value={editingProd.details}
                  onChange={(e) =>
                    setEditingProd({ ...editingProd, details: e.target.value })
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
    </div>
  );
}
