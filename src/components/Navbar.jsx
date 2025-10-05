import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-auto w-full">
      {/* Top Notice Bar */}
      <div className="bg-[#482922] text-white p-1 flex justify-center items-center font-light text-sm md:text-md cursor-pointer text-center">
        <h1>
          Welcome to our store! Enjoy shopping with exclusive deals and offers!
        </h1>
      </div>

      {/* Main Navbar */}
      <div className="bg-[#f5f0ed] text-[#482922] p-3 md:p-4 flex justify-between items-center relative">
        {/* Logo */}
        <h1
          className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-bold cursor-pointer transition-all duration-300"
          onClick={() => navigate("/")}
        >
          Vanokhi
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 sm:space-x-6 text-sm sm:text-base md:text-base lg:text-lg xl:text-xl transition-all duration-300">
          <button className="hover:font-bold" onClick={() => navigate("/prod")}>
            All Products
          </button>
          <button className="hover:font-bold">Categories</button>
          <button className="hover:font-bold">New Arrivals</button>
          <button className="hover:font-bold">About Us</button>
          <button className="hover:font-bold">Contact Us</button>
        </div>

        {/* Icons */}
        <div className="hidden md:flex space-x-2 sm:space-x-3 md:space-x-4">
          {["profile", "search", "cart"].map((icon, i) => (
            <button
              key={i}
              className="bg-[#482922] text-white rounded hover:bg-[#6f4e3e] w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex justify-center items-center transition-all duration-300"
            >
              <img
                src={`/imgs/${icon}_white.png`}
                alt={icon}
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
              />
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col justify-center items-center space-y-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-5 h-[2px] bg-[#482922]"></div>
          <div className="w-5 h-[2px] bg-[#482922]"></div>
          <div className="w-5 h-[2px] bg-[#482922]"></div>
        </button>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#f5f0ed] flex flex-col items-center space-y-3 py-4 md:hidden z-50">
            <button
              className="hover:font-bold"
              onClick={() => navigate("/prod")}
            >
              All Products
            </button>
            <button className="hover:font-bold">Categories</button>
            <button className="hover:font-bold">New Arrivals</button>
            <button className="hover:font-bold">About Us</button>
            <button className="hover:font-bold">Contact Us</button>
            <div className="flex space-x-3 mt-3">
              {["profile", "search", "cart"].map((icon, i) => (
                <button
                  key={i}
                  className="bg-[#482922] text-white rounded w-8 h-8 flex justify-center items-center"
                >
                  <img
                    src={`/imgs/${icon}_white.png`}
                    alt={icon}
                    className="w-4 h-4"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
