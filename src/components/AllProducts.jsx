import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { ALL_PRODUCTS } from "../data";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./AllProducts.css";

const AllProducts = () => {
  return (
    <div className="all-products-container">
      <h1 className="heading">Our Collection</h1>

      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
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
        {ALL_PRODUCTS.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="product-slide-content">
              <Link to={`/product/${product.id}`}>
                {/* Ensure the data.js uses product.img or update the key here */}
                <img src={product.pngimg} alt={product.name} />
              </Link>
              <div className="product-details-overlay">
                <h3>{product.name}</h3>
                <p>{product.price}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* <div className="slider-controler">
          <div className="swiper-button-prev slider-arrow">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </div>
          <div className="swiper-button-next slider-arrow">
            <ion-icon name="arrow-forward-outline"></ion-icon>
          </div>
          <div className="swiper-pagination"></div>
        </div> */}
      </Swiper>
    </div>
  );
};

export default AllProducts;
