import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const ProductTemp = () => {
  const navigate = useNavigate();

  // States
  const [mainImage, setMainImage] = useState("/imgs/prod1p1.png");
  const [quantity, setQuantity] = useState(1);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const thumbnails = [
    "/imgs/prod1p1.png",
    "/imgs/prod1p2.png",
    "/imgs/prod1p3.png",
    "/imgs/prod1p4.png",
  ];

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="min-h-screen bg-[#f5f0ed] md:min-h-screen md:bg-[#f5f0ed]">
      <Navbar />

      {/* MAIN CONTAINER */}
      <div className="flex flex-col mt-4 px-4 space-y-6 md:flex md:flex-row md:mt-[10px] md:h-[85vh] md:relative md:overflow-hidden md:space-y-0">
        {/* LEFT PANEL */}
        <div
          className="text-[#482922] flex flex-col space-y-4 md:absolute md:left-0 md:top-0 md:w-[50vw] md:h-full 
          md:overflow-hidden  md:z-10 md:flex md:flex-col md:justify-center md:items-start 
          md:px-16 md:space-y-6 md:text-[#482922]"
        >
          <div className="w-full md:w-3/4">
            <p className="text-xl font-semibold mt-2 md:text-2xl md:font-light md:mt-4">
              <span>₹1,895.00</span>{" "}
              <sup className="line-through md:line-through">₹2,000.00</sup>
            </p>
            <h1 className="text-2xl font-bold uppercase tracking-wide md:text-4xl md:font-extrabold md:tracking-wide md:uppercase">
              Jodha Sleeved Corset Kurti
            </h1>
            <p className="text-sm font-light text-[#5c3a32] leading-relaxed mt-2 md:max-w-md md:text-sm md:font-light md:text-[#5c3a32] md:leading-relaxed">
              Embrace elegance with our Jodha Sleeved Corset Kurti — a perfect
              blend of heritage and contemporary design crafted with intricate
              detailing. <br />
              Net Weight: 280g <br />
              Composition: 100% Pure Cotton (Handblock Printed) <br />
              Fit: Structured Body-Hugging Silhouette, Square Neckline with Long
              Fitted Sleeves. <br />
              Design & Print: Handcrafted Midnight Indigo Dabu Print,
              Corset-Inspired Stitching, Fusion of Tradition & Modern Elegance
            </p>

            {/* SIZE SELECTOR */}
            <div className="mt-4 md:mt-6">
              <p className="text-md font-semibold mb-2 md:text-md md:font-semibold md:mb-2">
                Select Size:
              </p>
              <div className="flex space-x-2 md:flex md:flex-row md:space-x-3">
                {[
                  { size: "S", available: true },
                  { size: "M", available: false },
                  { size: "L", available: true },
                  { size: "XL", available: true },
                  { size: "XXL", available: false },
                ].map(({ size, available }) => (
                  <div
                    key={size}
                    className={`relative w-9 h-9 flex justify-center items-center border rounded-full text-sm font-semibold cursor-pointer select-none transition-all duration-300 
                    md:relative md:w-10 md:h-10 md:flex md:justify-center md:items-center md:border 
                    md:rounded-full md:text-sm md:font-semibold md:cursor-pointer md:select-none md:transition-all md:duration-300
                    ${
                      available
                        ? "border-[#482922] text-[#482922] hover:bg-[#482922] hover:text-white md:border-[#482922] md:text-[#482922] md:hover:bg-[#482922] md:hover:text-white"
                        : "border-gray-400 text-gray-400 opacity-50 cursor-not-allowed md:border-gray-400 md:text-gray-400 md:opacity-50 md:cursor-not-allowed"
                    }`}
                  >
                    {size}
                    {!available && (
                      <span className="absolute w-[2px] h-6 bg-gray-500 rotate-45 md:absolute md:w-[2px] md:h-8 md:bg-gray-500 md:rotate-45"></span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* QUANTITY + CART */}
            <div className="mt-5 flex items-center space-x-3 md:mt-6 md:flex md:flex-row md:items-center md:space-x-4">
              <div className="flex items-center border border-[#482922] rounded-full overflow-hidden md:flex md:flex-row md:items-center md:border md:border-[#482922] md:rounded-full md:overflow-hidden">
                <button
                  onClick={decreaseQuantity}
                  className="px-3 py-1 text-lg font-semibold text-[#482922] hover:bg-[#482922] hover:text-white transition-all duration-300 md:px-3 md:py-1 md:text-lg md:font-semibold md:text-[#482922] md:hover:bg-[#482922] md:hover:text-white md:transition-all md:duration-300"
                >
                  -
                </button>
                <span className="px-4 text-md font-semibold text-[#482922] select-none md:px-4 md:text-md md:font-semibold md:text-[#482922] md:select-none">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="px-3 py-1 text-lg font-semibold text-[#482922] hover:bg-[#482922] hover:text-white transition-all duration-300 md:px-3 md:py-1 md:text-lg md:font-semibold md:text-[#482922] md:hover:bg-[#482922] md:hover:text-white md:transition-all md:duration-300"
                >
                  +
                </button>
              </div>

              <button className="bg-[#482922] text-white px-6 py-3 rounded-full hover:bg-[#6f4e3e] transition-all duration-300 md:bg-[#482922] md:text-white md:px-6 md:py-3 md:rounded-full md:hover:bg-[#6f4e3e] md:transition-all md:duration-300">
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col items-center md:flex md:flex-row md:w-[70%] md:h-full md:ml-auto md:items-center md:bg-[#f5f0ed] md:relative">
          {/* MAIN PRODUCT IMAGE */}
          <img
            src={mainImage}
            alt="Jodha Sleeved Corset Kurti"
            className="w-full object-contain drop-shadow-2xl transition-all duration-300 md:h-full md:object-contain md:drop-shadow-2xl md:transition-all md:duration-300"
          />

          {/* THUMBNAILS */}
          <div className="flex justify-center items-center mt-3 space-x-2  md:w-[20vw] md:h-full md:flex md:flex-col md:justify-center md:items-center md:space-y-2 md:space-x-0">
            {thumbnails.map((img, index) => (
              <div
                key={index}
                className="w-20 h-20 md:h-full flex justify-center items-center rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform md:w-full md:flex md:justify-center md:items-center md:rounded-lg md:overflow-hidden md:cursor-pointer"
                onClick={() => setMainImage(img)}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="object-contain max-h-[20vh] md:max-h-[24vh] md:object-contain md:transition-transform md:duration-300 md:hover:scale-105"
                />
              </div>
            ))}
          </div>

          {/* VIDEO + DETAILS */}
          <div className="w-full mt-6 md:w-[65%] md:h-full md:ml-auto md:flex md:flex-col md:bg-[#f5f0ed] md:relative">
            <div
              className={`relative w-full overflow-hidden transition-[height] duration-700 ease-in-out md:relative md:w-full md:overflow-hidden md:transition-[height] md:duration-700 md:ease-in-out ${
                isVideoPlaying ? "h-64 md:h-full" : "h-48 md:h-1/2"
              }`}
            >
              {!isVideoPlaying ? (
                <div className="bg-black w-full h-full relative overflow-hidden md:bg-black md:w-full md:h-full md:relative md:overflow-hidden">
                  <img
                    src="/imgs/prod1p5.jpg"
                    alt=""
                    className="object-cover w-full h-full md:object-cover md:w-full md:h-full"
                  />
                  <div
                    onClick={() => setIsVideoPlaying(true)}
                    className="absolute bottom-3 left-3 rounded-full bg-white p-2 cursor-pointer hover:scale-105 transition-transform md:absolute md:bottom-5 md:left-5 md:rounded-full md:bg-white md:p-2 md:cursor-pointer md:hover:scale-105 md:transition-transform"
                  >
                    <img
                      src="/imgs/play_black.png"
                      alt="play"
                      className="w-6 h-6 md:w-8 md:h-8"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full h-full relative bg-black md:w-full md:h-full md:relative md:bg-black">
                  <video
                    src="/videos/prod1v1.mp4"
                    autoPlay
                    muted
                    loop
                    className="object-cover w-full h-full md:object-cover md:w-full md:h-full"
                  />
                  <div
                    onClick={() => setIsVideoPlaying(false)}
                    className="absolute bottom-3 left-3 rounded-full bg-white p-2 cursor-pointer hover:scale-105 transition-transform md:absolute md:bottom-5 md:left-5 md:rounded-full md:bg-white md:p-2 md:cursor-pointer md:hover:scale-105 md:transition-transform"
                  >
                    <img
                      src="/imgs/close_black.png"
                      alt="close"
                      className="w-6 h-6 md:w-8 md:h-8"
                    />
                  </div>
                </div>
              )}
            </div>

            {!isVideoPlaying && (
              <div className="p-4 text-[#482922] overflow-hidden bg-[#f5f0ed] shadow-sm md:h-1/2 md:p-6 md:text-[#482922] md:overflow-hidden md:bg-[#f5f0ed] md:shadow-t">
                <p>
                  <strong>Manufacturer:</strong> VANOKHI FASHION STUDIO
                </p>
                <p>
                  <strong>Packer:</strong> VANOKHI FASHION STUDIO
                </p>
                <p>
                  <strong>Supplier:</strong> Vanokhi Fashion Studio, Distributed
                  by: Vanokhi Lifestyle & Co.
                </p>
                <p>
                  <strong>Contact:</strong> support@vanokhi.in
                </p>
                <p>
                  <strong>Technical Details:</strong> Handblock Printed,
                  Eco-Friendly Indigo Pigments, Lightweight & Breathable, Wash:
                  Gentle Hand Wash / Dry in Shade / Avoid Direct Sunlight
                </p>
                <p className="mt-2 text-xs text-gray-500 md:mt-2 md:text-xs md:text-gray-500">
                  ⚖️ Legal Disclaimer: Images for illustrative purposes. Actual
                  color, pattern, or texture may vary.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTemp;
