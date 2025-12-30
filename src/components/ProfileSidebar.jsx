import React, { useState } from "react";
import { Link } from "react-router-dom"; // Add this
import "./ProfileSidebar.css";
import {
  X,
  Package,
  Heart,
  Settings,
  LogOut,
  User,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import LoginPage from "./LoginPage";
import { useAuth } from "../context/AuthContext";

export default function ProfileSidebar({ isOpen, onClose }) {
  const { currentUser, logout, verifyEmail } = useAuth();
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

        {currentUser ? (
          <div className="profile-content">
            <div className="user-info">
              <div className="avatar-circle">
                {currentUser.displayName
                  ? currentUser.displayName.charAt(0).toUpperCase()
                  : "U"}
              </div>
              <h3>{currentUser.displayName || "User"}</h3>
              <p>{currentUser.email}</p>
            </div>

            <nav className="profile-menu">
              <Link to="/orders" className="menu-item" onClick={onClose}>
                <Package size={20} /> My Orders
              </Link>
              <Link to="/wishlist" className="menu-item" onClick={onClose}>
                <Heart size={20} /> Wishlist
              </Link>
              <Link to="/settings" className="menu-item" onClick={onClose}>
                <Settings size={20} /> Settings
              </Link>
            </nav>

            <button className="logout-btn" onClick={logout}>
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
      {showLoginModal && <LoginPage onClose={() => setShowLoginModal(false)} />}
    </>
  );
}
