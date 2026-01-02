// src/components/NewArivals.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ALL_PRODUCTS } from "../data";
import "./NewArivals.css";

const NewArivals = () => {
  // Show the first 4 products as new arrivals
  const arrivals = ALL_PRODUCTS.slice(0, 4);

  return (
    <section className="new-arrivals">
      <div className="arrival-header">
        <h2 className="section-title">New Arrivals</h2>
        <Link to="/collections" className="view-all">
          View All
        </Link>
      </div>

      <div className="arrival-grid">
        {arrivals.map((item) => (
          <div key={item.id} className="arrival-card">
            <Link to={`/product/${item.id}`} className="card-img-link">
              <img src={item.img} alt={item.name} />
            </Link>
            <div className="card-details">
              <span className="brand-label">Vanokhi</span>
              <Link to={`/product/${item.id}`} className="product-name-link">
                <h3>{item.name}</h3>
              </Link>
              <p className="price">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArivals;
