import React, { useState } from "react";
import "./ProfileSidebar.css";
import { X, Package, Heart, Settings, LogOut, User, AlertCircle, CheckCircle } from "lucide-react";
import LoginPage from "./LoginPage";
import { useAuth } from "../context/AuthContext";

export default function ProfileSidebar({ isOpen, onClose }) {
  const { currentUser, logout, verifyEmail } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerify = async () => {
    if (currentUser) {
      try {
        await verifyEmail(currentUser);
        setVerificationSent(true);
      } catch (error) {
        console.error("Verification failed", error);
        alert("Failed to send verification email. Try again later.");
      }
    }
  };

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
          // LOGGED IN VIEW
          <div className="profile-content">
            <div className="user-info">
              <div className="avatar-circle">
                {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : "U"}
              </div>
              <h3>{currentUser.displayName || "User"}</h3>
              <p>{currentUser.email}</p>

              {/* EMAIL VERIFICATION SECTION */}
              {!currentUser.emailVerified && (
                <div className="verification-warning">
                  {verificationSent ? (
                    <div className="verify-success">
                      <CheckCircle size={14} /> Email sent! Check inbox.
                    </div>
                  ) : (
                    <>
                      <div className="verify-alert">
                        <AlertCircle size={14} /> Email not verified
                      </div>
                      <button onClick={handleVerify} className="verify-btn">
                        Verify Now
                      </button>
                    </>
                  )}
                </div>
              )}
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

            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        ) : (
          // GUEST VIEW
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

      {/* Login Modal */}
      {showLoginModal && (
        <LoginPage onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
}