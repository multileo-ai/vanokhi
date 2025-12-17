import React, { useState } from "react";
import "./ProfileSidebar.css";
import { X, Package, Heart, Settings, LogOut, User } from "lucide-react";
import LoginPage from "./LoginPage";

export default function ProfileSidebar({ isOpen, onClose }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Toggle to test views
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? "open" : ""}`} 
        onClick={onClose} 
      />
      
      <div className={`profile-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Account</h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        {isLoggedIn ? (
          <div className="profile-content">
            <div className="user-info">
              <div className="avatar-circle">SJ</div>
              <h3>Sneha Jain</h3>
              <p>sneha.jain@example.com</p>
            </div>

            <nav className="profile-menu">
              <a href="#orders" className="menu-item">
                <Package size={20} /> My Orders
              </a>
              <a href="#wishlist" className="menu-item">
                <Heart size={20} /> Wishlist
              </a>
              <a href="#settings" className="menu-item">
                <Settings size={20} /> Settings
              </a>
            </nav>

            <button className="logout-btn" onClick={() => setIsLoggedIn(false)}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        ) : (
          <div className="guest-view">
            <div className="guest-icon">
              <User size={48} strokeWidth={1} />
            </div>
            <h3>Welcome to Vanokhi</h3>
            <p>Log in to access your orders, wishlist and more.</p>
            <button 
              className="login-trigger-btn" 
              onClick={() => setShowLoginModal(true)}
            >
              LOGIN / SIGNUP
            </button>
          </div>
        )}
      </div>

      {/* Login Modal Integration */}
      {showLoginModal && (
        <LoginPage onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
}