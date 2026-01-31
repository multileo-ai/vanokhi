import React, { useState } from "react";
import "./LoginPage.css";
import { X, ArrowLeft } from "lucide-react"; // Added ArrowLeft
import { useAuth } from "../context/AuthContext";

export default function LoginPage({ onClose }) {
  const { login, signup, googleLogin, resetPassword } = useAuth();

  // Tabs: 'login', 'signup', 'forgot'
  const [activeTab, setActiveTab] = useState("login");

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // For success messages
  const [loading, setLoading] = useState(false);

  // Handle Login / Signup
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      if (activeTab === "login") {
        await login(email, password);
        onClose();
      } else if (activeTab === "signup") {
        await signup(email, password, fullName);
        // Don't close immediately, let them know verification was sent
        setActiveTab("login");
        setMessage(
          "Account created! Please check your email to verify your account.",
        );
        setLoading(false);
        return;
      }
    } catch (err) {
      handleError(err);
    }
    setLoading(false);
  }

  // Handle Forgot Password
  async function handleResetPassword(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage("Check your inbox for password reset instructions.");
    } catch (err) {
      handleError(err);
    }
    setLoading(false);
  }

  async function handleGoogleLogin() {
    setError("");
    try {
      // 1. Trigger the native bottom-sheet picker
      const user = await GoogleAuth.signIn();

      // 2. Create the Firebase credential using the token from native login
      const credential = GoogleAuthProvider.credential(
        user.authentication.idToken,
      );

      // 3. Sign into your Firebase project
      await signInWithCredential(auth, credential);

      onClose(); // Close the modal on success
    } catch (err) {
      console.error("Native Login Error:", err);
      setError("Google Sign-In failed. Please try again.");
    }
  }

  // async function handleGoogleLogin() {
  //   setError("");
  //   try {
  //     await googleLogin();
  //     onClose();
  //   } catch (err) {
  //     handleError(err);
  //   }
  // }

  function handleError(err) {
    console.error(err);
    if (err.code === "auth/invalid-credential")
      setError("Incorrect email or password.");
    else if (err.code === "auth/email-already-in-use")
      setError("Email is already registered.");
    else if (err.code === "auth/user-not-found")
      setError("No account found with this email.");
    else if (err.code === "auth/weak-password")
      setError("Password must be at least 6 characters.");
    else setError("Request failed. Please try again.");
  }

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-container">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Left Side */}
        <div className="login-left-panel">
          <div className="panel-content">
            <h1 className="brand-title">Vanokhi</h1>
            <p className="brand-quote">" द वाह मोमेंट "</p>
          </div>
          <div className="panel-overlay"></div>
          <img src="/Rectangle 3.png" alt="Fashion" className="panel-bg" />
        </div>

        {/* Right Side */}
        <div className="login-right-panel">
          {/* Header */}
          <div className="auth-header">
            <h2>
              {activeTab === "login" && "Welcome Back"}
              {activeTab === "signup" && "Create Account"}
              {activeTab === "forgot" && "Reset Password"}
            </h2>
            <p>
              {activeTab === "login" && "Please enter your details."}
              {activeTab === "signup" &&
                "Join the world of sustainable luxury."}
              {activeTab === "forgot" &&
                "Enter your email to receive a reset link."}
            </p>
          </div>

          {/* Success / Error Messages */}
          {error && <div className="error-msg">{error}</div>}
          {message && <div className="success-msg">{message}</div>}

          {/* --- FORGOT PASSWORD VIEW --- */}
          {activeTab === "forgot" ? (
            <form className="auth-form" onSubmit={handleResetPassword}>
              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "SENDING..." : "SEND RESET LINK"}
              </button>
              <button
                type="button"
                className="back-link"
                onClick={() => {
                  setActiveTab("login");
                  setError("");
                  setMessage("");
                }}
              >
                <ArrowLeft size={14} style={{ marginRight: "5px" }} /> Back to
                Login
              </button>
            </form>
          ) : (
            /* --- LOGIN / SIGNUP VIEW --- */
            <>
              <div className="auth-tabs">
                <button
                  className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("login");
                    setError("");
                    setMessage("");
                  }}
                >
                  Log In
                </button>
                <button
                  className={`tab-btn ${
                    activeTab === "signup" ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveTab("signup");
                    setError("");
                    setMessage("");
                  }}
                >
                  Sign Up
                </button>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                {activeTab === "signup" && (
                  <div className="input-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                )}

                <div className="input-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {activeTab === "login" && (
                  <div className="form-options">
                    <label className="checkbox-label">
                      <input type="checkbox" /> Remember me
                    </label>
                    <button
                      type="button"
                      className="forgot-link-btn"
                      onClick={() => setActiveTab("forgot")}
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading
                    ? "PROCESSING..."
                    : activeTab === "login"
                    ? "LOGIN"
                    : "CREATE ACCOUNT"}
                </button>
              </form>

              <div className="divider">
                <span>OR</span>
              </div>
              <button className="google-btn" onClick={handleGoogleLogin}>
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                />
                Continue with Google
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
