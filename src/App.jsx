import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductTemp from "./pages/ProductTemp";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              // <div>
              //   <Navbar />
              //   <div className="flex justify-center items-center h-screen">
              //     <h1 className="text-4xl font-bold">Welcome to Our Store</h1>
              //   </div>
              // </div>
              <ProductTemp />
            }
          />

          <Route path="/prod" element={<ProductTemp />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
