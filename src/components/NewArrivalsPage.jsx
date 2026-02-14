// src/components/NewArrivalsPage.jsx
import React from "react";
import { ShoppingBag, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AverageRating from "./AverageRating";
import "./NewArrivalsPage.css";

import Skeleton from "./common/Skeleton";

const NewArrivalsPage = () => {
  const { addToCart, addToWishlist, userData, liveProducts } = useAuth();

  // Create a loading state derived from liveProducts length or specific loading flag if available
  // Since we rely on liveProducts, we'll assume loading if it's empty (though it could just be empty store)
  // For better UX during initial load, we can use a local 'loading' state if not provided by context.
  // However, liveProducts updates in real-time. If it's empty initially, we show skeleton.
  // Image loading state
  const [bannerLoaded, setBannerLoaded] = React.useState(false);

  // Derive loading state from products availability
  const isLoading = !liveProducts || liveProducts.length === 0;

  // Combined loading state: Products must be ready AND banner must be loaded
  const isPageReady = !isLoading && bannerLoaded;

  // Get the latest products
  const products = [...liveProducts].reverse().slice(0, 9);

  return (
    <div className="na-main-wrapper">
      {!isPageReady && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "#fff",
            overflowY: "auto",
          }}
        >
          {/* Full Page Skeleton Overlay */}
          <div className="na-header-section na-mobile-16-9">
            <Skeleton type="block" style={{ width: "100%", height: "100%" }} />
          </div>
          <div className="na-product-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="na-glass-card" style={{ padding: "0" }}>
                <Skeleton
                  type="block"
                  style={{ height: "350px", width: "100%" }}
                />
                <div style={{ padding: "15px" }}>
                  <Skeleton type="text" style={{ marginBottom: "10px" }} />
                  <Skeleton type="text" style={{ width: "60%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actual Content - Hidden until ready */}
      <div style={{ visibility: isPageReady ? "visible" : "hidden" }}>
        <div className="na-header-section na-mobile-16-9">
          <div className="na-header-bg">
            <img
              src="/DSC00618.avif"
              alt="New Arrivals"
              onLoad={() => setBannerLoaded(true)}
            />
          </div>
          <div className="na-header-text">
            <h1>NEW ARRIVALS</h1>
          </div>
        </div>

        <div className="na-product-grid">
          {products.map((item) => {
            const isOutOfStock = item.stock === 0;
            const isInWishlist = userData?.wishlist?.some(
              (w) => w.id === item.id,
            );

            return (
              <div
                key={item.id}
                className={`na-glass-card ${isOutOfStock ? "out-of-stock" : ""}`}
              >
                <div className="na-card-top">
                  <Link to={`/product/${item.id}`}>
                    <img
                      src={item.img}
                      alt={item.name}
                      className="na-main-img"
                    />
                  </Link>

                  <div className="na-rating-tag">
                    <AverageRating productId={item.id} />
                  </div>

                  <div className="na-glass-actions">
                    <button
                      className={`na-action-circle ${isInWishlist ? "active" : ""
                        }`}
                      onClick={() => addToWishlist(item)}
                    >
                      <Heart
                        size={18}
                        fill={isInWishlist ? "#860204" : "none"}
                        color={isInWishlist ? "#860204" : "white"}
                      />
                    </button>
                    <button
                      className="na-action-rect"
                      onClick={() =>
                        addToCart(item, "M", item.sizes?.[0] || "M")
                      }
                    >
                      <ShoppingBag size={18} />
                      <span>ADD TO BAG</span>
                    </button>
                  </div>
                </div>

                <div className="na-card-bottom">
                  <h3 className="na-item-title">{item.name}</h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <p className="global-product-price">{item.price}</p>
                    {item.originalPrice && (
                      <p className="global-product-price-original">
                        {item.originalPrice}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NewArrivalsPage;
