import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const ProductTemp = () => {
  const navigate = useNavigate();

  // State to track selected image
  const [mainImage, setMainImage] = useState("/imgs/prod1p1.png");

  // Quantity state
  const [quantity, setQuantity] = useState(1);

  // Video toggle state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const thumbnails = [
    "/imgs/prod1p1.png",
    "/imgs/prod1p2.png",
    "/imgs/prod1p3.png",
    "/imgs/prod1p4.png",
  ];

  // Handle increment & decrement
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="min-h-screen bg-[#f5f0ed]">
      <Navbar />
      <div className="flex mt-[10px] h-[85vh] relative overflow-hidden">
        {/* LEFT PANEL */}
        <div
          className="absolute left-0 top-0 w-[50vw] h-full overflow-hidden
                     shadow-lg z-10 flex flex-col justify-center items-start 
                     px-16 space-y-6 text-[#482922]"
        >
          <div className="w-3/4">
            <p className="text-2xl font-light">
              <span className="">₹1,895.00</span>{" "}
              <sup className="line-through">₹2,000.00</sup>
            </p>
            <h1 className="text-4xl font-extrabold tracking-wide uppercase">
              Jodha Sleeved Corset Kurti
            </h1>
            <p className="max-w-md text-sm font-light text-[#5c3a32] leading-relaxed">
              Embrace elegance with our Jodha Sleeved Corset Kurti — a perfect
              blend of heritage and contemporary design crafted with intricate
              detailing. <br />
              Net Weight: 280g <br />
              Composition: 100% Pure Cotton (Handblock Printed) <br />
              Fit:Structured Body-Hugging Silhouette, Square Neckline with Long
              Fitted Sleeves.
              <br /> Design & Print: Handcrafted Midnight Indigo Dabu Print,
              Corset-Inspired Stitching, Fusion of Tradition & Modern Elegance
            </p>

            {/* Size Selection Section */}
            <div className="mt-6">
              <p className="text-md font-semibold mb-2">Select Size:</p>
              <div className="flex space-x-3">
                {[
                  { size: "S", available: true },
                  { size: "M", available: false },
                  { size: "L", available: true },
                  { size: "XL", available: true },
                  { size: "XXL", available: false },
                ].map(({ size, available }) => (
                  <div
                    key={size}
                    className={`relative w-10 h-10 flex justify-center items-center border 
                    rounded-full text-sm font-semibold cursor-pointer select-none transition-all duration-300
                    ${
                      available
                        ? "border-[#482922] text-[#482922] hover:bg-[#482922] hover:text-white"
                        : "border-gray-400 text-gray-400 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    {size}
                    {!available && (
                      <span className="absolute w-[2px] h-8 bg-gray-500 rotate-45"></span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Selector + Add to Cart */}
            <div className="mt-6 flex items-center space-x-4">
              <div className="flex items-center border border-[#482922] rounded-full overflow-hidden">
                <button
                  onClick={decreaseQuantity}
                  className="px-3 py-1 text-lg font-semibold text-[#482922] hover:bg-[#482922] hover:text-white transition-all duration-300"
                >
                  -
                </button>
                <span className="px-4 text-md font-semibold text-[#482922] select-none">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="px-3 py-1 text-lg font-semibold text-[#482922] hover:bg-[#482922] hover:text-white transition-all duration-300"
                >
                  +
                </button>
              </div>

              <button className="bg-[#482922] text-white px-6 py-3 rounded-full hover:bg-[#6f4e3e] transition-all duration-300">
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE + VIDEO SECTION */}
        <div className="w-[65%] h-full ml-auto flex items-center bg-[#f5f0ed] relative">
          {/* Main Product Image */}
          <img
            src={mainImage}
            alt="Jodha Sleeved Corset Kurti"
            className="h-full object-contain drop-shadow-2xl transition-all duration-300"
          />

          {/* Thumbnail Column */}
          <div className="ml-2 w-[10vw] h-full flex flex-col justify-center items-center space-y-2">
            {thumbnails.map((img, index) => (
              <div
                key={index}
                className="w-full flex justify-center items-center rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setMainImage(img)}
              >
                <img
                  src={img}
                  alt={`Product thumbnail ${index + 1}`}
                  className="max-h-[24vh] object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>

          {/* RIGHT IMAGE + VIDEO SECTION */}
          <div className="w-[65%] h-full ml-auto flex flex-col bg-[#f5f0ed] relative">
            {/* IMAGE / VIDEO TOP HALF */}
            <div
              className={`relative w-full overflow-hidden transition-[height] duration-700 ease-in-out ${
                isVideoPlaying ? "h-full" : "h-1/2"
              }`}
            >
              {!isVideoPlaying ? (
                <div className="bg-black w-full h-full relative overflow-hidden">
                  <img
                    src="/imgs/prod1p5.jpg"
                    alt=""
                    className="object-cover w-full h-full"
                  />
                  {/* Play Button */}
                  <div
                    onClick={() => setIsVideoPlaying(true)}
                    className="absolute bottom-5 left-5 rounded-full bg-white p-2 cursor-pointer hover:scale-105 transition-transform"
                  >
                    <img
                      src="/imgs/play_black.png"
                      alt=""
                      className="w-8 h-8"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full h-full relative bg-black">
                  <video
                    src="/videos/prod1v1.mp4"
                    autoPlay
                    muted
                    loop
                    className="object-cover w-full h-full"
                  />
                  {/* Close Button */}
                  <div
                    onClick={() => setIsVideoPlaying(false)}
                    className="absolute bottom-5 left-5 rounded-full bg-white p-2 cursor-pointer hover:scale-105 transition-transform"
                  >
                    <img
                      src="/imgs/close_black.png"
                      alt="close"
                      className="w-8 h-8"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* DESCRIPTION BOTTOM HALF */}
            {!isVideoPlaying && (
              <div className="h-1/2 p-6 text-[#482922] overflow-hidden bg-[#f5f0ed] shadow-t">
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
                <p className="mt-2 text-xs text-gray-500">
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
