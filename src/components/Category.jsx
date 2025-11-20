import React from "react";
import "./Category.css";

const products = [
  { id: 1, name: "Silk Saree", img: "https://i.pinimg.com/736x/c4/8a/99/c48a99596ac597f1c7fd6dfbbb4d7c7b.jpg" },
  { id: 2, name: "Lehengas", img: "https://i.pinimg.com/1200x/68/3b/a0/683ba0f90fae407b436b363522d0b338.jpg" },
  { id: 3, name: "Kurtas", img: "https://i.pinimg.com/736x/54/46/58/544658b8ab93d5419d6449f76117962f.jpg" },
  { id: 4, name: "Dupattas", img: "https://i.pinimg.com/1200x/60/b7/02/60b702d5b66b2c8853c241e902756748.jpg" },
  { id: 5, name: "Skirts", img: "https://i.pinimg.com/736x/3b/75/27/3b7527c6ce266d2f9f1f5fa4f68696e1.jpg" },
  { id: 6, name: "Anarkali", img: "https://i.pinimg.com/1200x/e1/0a/fb/e10afb821a84f784065acfeb274a7f24.jpg" },
  { id: 7, name: "Kurti", img: "https://i.pinimg.com/736x/e2/1e/91/e21e91ed38e13e6661ca0caaa0925c09.jpg" },
  { id: 8, name: "Saree", img: "https://i.pinimg.com/1200x/6e/c1/d9/6ec1d9af829518f80faecd87c2c03357.jpg" },
];

const Category = () => {
  // Duplicate the array so the track can loop seamlessly
  const loopItems = [...products, ...products];

  return (
    <section className="category-section">
      <h2 className="category-heading">Shop the Look</h2>

      <div className="category-wrapper">
        <div className="track">
          {loopItems.map((product, idx) => (
            <article className="card" key={`${product.id}-${idx}`}>
              <img src={product.img} alt={product.name} className="card-img" />
              <div className="overlay">
                <p className="product-name">{product.name}</p>
                <button className="quick-view">Quick View</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;
