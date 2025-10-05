import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="h-auto w-full">
      <div className="bg-[#482922] text-white p-1 flex justify-center items-center font-light text-md cursor-pointer">
        <h1>
          Welcome to our store! Enjoy shopping with exclusive deals and offers!
        </h1>
      </div>

      <div className="bg-[#f5f0ed] text-[#482922] p-4 flex justify-between items-center">
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Vanokhi
        </h1>

        <div className="flex space-x-6">
          <button
            className="ml-4 hover:font-bold"
            onClick={() => navigate("/prod")}
          >
            All Products
          </button>
          <button className="ml-4 hover:font-bold">Categories</button>
          <button className="ml-4 hover:font-bold">New Arrivals</button>
          <button className="ml-4 hover:font-bold">About Us</button>
          <button className="ml-4 hover:font-bold">Contact Us</button>
        </div>

        <div className="flex space-x-4">
          <button className="bg-[#482922] text-white p-2 rounded hover:bg-[#6f4e3e] w-[40px] h-[40px] flex justify-center items-center cursor-pointer">
            <img src="/imgs/profile_white.png" alt="profile" />
          </button>
          <button className="bg-[#482922] text-white p-2 rounded hover:bg-[#6f4e3e] w-[40px] h-[40px] flex justify-center items-center cursor-pointer">
            <img src="/imgs/search_white.png" alt="search" />
          </button>
          <button className="bg-[#482922] text-white p-2 rounded hover:bg-[#6f4e3e] w-[40px] h-[40px] flex justify-center items-center cursor-pointer">
            <img src="/imgs/cart_white.png" alt="cart" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
