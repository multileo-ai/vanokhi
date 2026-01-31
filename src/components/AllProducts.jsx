import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { db } from "../firebase"; // Import the Firestore database instance
import { collection, getDocs } from "firebase/firestore"; // Import Firestore methods

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./AllProducts.css";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsArray);
      } catch (error) {
        console.error("Error fetching products from Firestore: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="loading-container">Loading Products...</div>;
  }

  return (
    <div className="all-products-container">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        loopAdditionalSlides={10}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
          slideShadows: false,
        }}
        /* ADD BREAKPOINTS HERE */
        breakpoints={{
          // Mobile: optimized for 3 visible images
          320: {
            coverflowEffect: {
              depth: 80, // Keeps side images closer
              modifier: 1.2, // Prevents extreme overlap that pushes images off-screen
            },
          },
          // Desktop: your original aesthetic
          768: {
            coverflowEffect: {
              depth: 100,
              modifier: 2.5,
            },
          },
        }}
        pagination={{ el: ".swiper-pagination", clickable: true }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
          clickable: true,
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="swiper_container"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="product-slide-content">
              <Link to={`/product/${product.id}`}>
                {/* Matches your data.js structure: uses pngimg if available, 
                  falls back to standard img or gallery array if necessary 
                */}
                <img
                  src={
                    product.pngimg ||
                    (product.galleryPNG && product.galleryPNG[0]) ||
                    product.img
                  }
                  alt={product.name}
                />
              </Link>
              <div className="product-details-overlay">
                <h3>{product.name}</h3>
                <p>{product.price}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* <div className="swiper-pagination"></div> */}
      </Swiper>
    </div>
  );
};

export default AllProducts;
