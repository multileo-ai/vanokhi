import React, { useState } from "react";
import "./LoginPage.css";
import { X } from "lucide-react";

export default function LoginPage({ onClose }) {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-container">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Left Side: Brand Image */}
        <div className="login-left-panel">
          <div className="panel-content">
            <h1 className="brand-title">Vanokhi</h1>
            <p className="brand-quote">" द वाह मोमेंट "</p>
          </div>
          <div className="panel-overlay"></div>
          {/* Ensure this image path is correct */}
          <img src="/Rectangle 3.png" alt="Fashion" className="panel-bg" />
        </div>

        {/* Right Side: Form */}
        <div className="login-right-panel">
          <div className="auth-tabs">
            <button
              className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Log In
            </button>
            <button
              className={`tab-btn ${activeTab === "signup" ? "active" : ""}`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          <div className="auth-form-container">
            {activeTab === "login" ? (
              <form className="auth-form">
                <h2>Welcome Back</h2>
                <p>Please enter your details to sign in.</p>

                <div className="input-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="john@example.com" />
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <input type="password" placeholder="••••••••" />
                </div>

                <div className="form-options">
                  <label className="checkbox-label">
                    <input type="checkbox" /> Remember me
                  </label>
                  <a href="#forgot" className="forgot-link">
                    Forgot Password?
                  </a>
                </div>

                <button type="button" className="submit-btn">
                  SIGN IN
                </button>
              </form>
            ) : (
              <form className="auth-form">
                <h2>Create Account</h2>
                <p>Join the world of sustainable luxury.</p>

                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="John Doe" />
                </div>

                <div className="input-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="john@example.com" />
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <input type="password" placeholder="••••••••" />
                </div>

                <button type="button" className="submit-btn">
                  CREATE ACCOUNT
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
