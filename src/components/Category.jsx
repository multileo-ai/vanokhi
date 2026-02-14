import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Category.css";
import { useAuth } from "../context/AuthContext";

const Category = () => {
  const { liveProducts } = useAuth();
  const navigate = useNavigate();
  if (!liveProducts || liveProducts.length === 0) return null;

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const loopItems = [...liveProducts, ...liveProducts];
  return (
    <section className="category-section">
      <div className="category-wrapper">
        <div className="track">
          {loopItems.map((product, idx) => (
            <article className="card" key={`${product.id}-${idx}`}>
              {/* Fetches 'img' and 'name' fields from Firestore */}
              <img src={product.img} alt={product.name} className="card-img" loading="lazy" />
              <div className="overlay">
                <p className="product-name">{product.name}</p>
                <button
                  className="quick-view"
                  onClick={() => handleProductClick(product.id)}
                >
                  Quick View
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;
