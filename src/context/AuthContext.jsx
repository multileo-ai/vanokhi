import React, { useContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase"; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification
} from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Signup
  async function signup(email, password, fullName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: fullName });
    // Optional: Send verification email immediately upon signup
    await sendEmailVerification(userCredential.user); 
    return userCredential;
  }

  // 2. Login
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // 3. Google Login
  function googleLogin() {
    return signInWithPopup(auth, googleProvider);
  }

  // 4. Logout
  function logout() {
    return signOut(auth);
  }

  // 5. Password Reset (NEW)
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // 6. Email Verification (NEW)
  function verifyEmail(user) {
    return sendEmailVerification(user);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    googleLogin,
    logout,
    resetPassword,
    verifyEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}