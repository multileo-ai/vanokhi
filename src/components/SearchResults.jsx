// src/components/SearchResults.jsx
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ShoppingBag, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AverageRating from "./AverageRating";
import "./SearchResults.css";

const SearchResults = () => {
  const { liveProducts, liveCollections, addToCart, addToWishlist, userData } = useAuth();
  const location = useLocation();

  // Extract search query from URL (?q=...)
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("q")?.toLowerCase().trim() || "";

  // Common fashion keyword aliases — maps user search terms to related words
  const keywordAliases = {
    kurti: ["kurta", "kurtis", "kurties", "kurti"],
    kurta: ["kurti", "kurtis", "kurties", "kurta"],
    kurties: ["kurti", "kurta", "kurtis", "kurties"],
    kurtis: ["kurti", "kurta", "kurties", "kurtis"],
    saree: ["sari", "sarees", "saris", "saree"],
    sari: ["saree", "sarees", "saris", "sari"],
    pants: ["pant", "trouser", "trousers", "bottom", "bottoms", "pants"],
    pant: ["pants", "trouser", "trousers", "bottom", "bottoms"],
    top: ["tops", "blouse", "shirt", "top"],
    tops: ["top", "blouse", "shirt", "tops"],
    dress: ["dresses", "gown", "frock", "dress"],
    skirt: ["skirts", "lehenga", "ghagra", "skirt"],
    corset: ["corsets", "bustier", "blouse", "corset"],
    cotton: ["cotton", "mul cotton", "organic cotton"],
    linen: ["linen", "flax"],
    silk: ["silk", "silky"],
    shirt: ["shirts", "top", "tops", "tshirt", "t-shirt"],
    lehenga: ["lehengas", "ghagra", "skirt"],
    dupatta: ["dupattas", "stole", "scarf"],
    ethnic: ["traditional", "indian", "desi", "ethnic"],
    western: ["modern", "casual", "western"],
  };

  // Expand search term with aliases
  const expandSearch = (term) => {
    const words = term.split(/\s+/).filter(Boolean);
    const expandedSets = words.map((word) => {
      const aliases = keywordAliases[word] || [];
      return [word, ...aliases];
    });
    return expandedSets;
  };

  // Build collection ID → title map
  const collectionMap = {};
  liveCollections.forEach((col) => {
    collectionMap[col.id] = (col.title || col.name || "").toLowerCase();
  });

  // Find collections whose title matches search term (with aliases)
  const expandedTerms = expandSearch(searchTerm);
  const matchingCollectionIds = liveCollections
    .filter((col) => {
      const colTitle = (col.title || col.name || "").toLowerCase();
      return expandedTerms.some((wordGroup) =>
        wordGroup.some((alias) => colTitle.includes(alias))
      );
    })
    .map((col) => col.id);

  // Collect productIds from matching collections
  const productIdsFromCollections = new Set();
  liveCollections.forEach((col) => {
    if (matchingCollectionIds.includes(col.id) && col.productIds) {
      col.productIds.forEach((pid) => productIdsFromCollections.add(pid));
    }
  });

  // Filter products
  const filteredProducts = liveProducts.filter((product) => {
    if (!searchTerm) return true;

    // 1. Check if product is in a matching collection (via productIds)
    if (productIdsFromCollections.has(product.id)) return true;

    // 2. Check if product's collectionId matches a matching collection
    if (product.collectionId && matchingCollectionIds.includes(product.collectionId)) return true;

    // 3. Search all string fields on product + resolved collection name
    const collectionTitle = product.collectionId ? (collectionMap[product.collectionId] || "") : "";
    const fieldValues = Object.values(product).flatMap((val) => {
      if (typeof val === "string") return [val];
      if (Array.isArray(val)) return val.filter((v) => typeof v === "string");
      return [];
    });
    fieldValues.push(collectionTitle);
    const searchableText = fieldValues.join(" ").toLowerCase();

    // Check if ALL search words (with aliases) match
    return expandedTerms.every((wordGroup) =>
      wordGroup.some((alias) => searchableText.includes(alias))
    );
  });

  return (
    <div className="sr-main-wrapper">
      {/* Header matching themed pages */}
      <div className="sr-header-section sr-mobile-16-9">
        <div className="sr-header-text">
          <h1>SEARCH: {searchTerm.toUpperCase()}</h1>
        </div>
      </div>

      <div className="sr-product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => {
            const isOutOfStock = item.stock === 0;
            const isInWishlist = userData?.wishlist?.some(
              (w) => w.id === item.id,
            );

            return (
              <div
                key={item.id}
                className={`sr-glass-card ${isOutOfStock ? "out-of-stock" : ""
                  }`}
              >
                <div className="sr-card-top">
                  <Link to={`/product/${item.id}`}>
                    <img
                      src={item.img}
                      alt={item.name}
                      className="sr-main-img"
                    />
                  </Link>

                  <div className="sr-rating-tag">
                    <AverageRating productId={item.id} />
                  </div>

                  <div className="sr-glass-actions">
                    <button
                      className={`sr-action-circle ${isInWishlist ? "active" : ""
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
                      className="sr-action-rect"
                      onClick={() => addToCart(item, item.sizes?.[0] || "M")}
                    >
                      <ShoppingBag size={18} />
                      <span>ADD TO BAG</span>
                    </button>
                  </div>
                </div>

                <div className="sr-card-bottom">
                  <h3 className="sr-item-title">{item.name}</h3>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <p className="sr-item-price">{item.price} INR</p>
                    {item.originalPrice && (
                      <p
                        className="sr-item-price original"
                        style={{
                          textDecoration: "line-through",
                          color: "#999",
                          fontSize: "0.9em",
                        }}
                      >
                        {item.originalPrice} INR
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="sr-no-results">
            <h2>No results found for "{searchTerm}"</h2>
            <Link to="/all-products" className="sr-back-link">
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
