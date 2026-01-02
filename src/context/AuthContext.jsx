import React, { useContext, useState, useEffect } from "react";
import { auth, db, googleProvider } from "../firebase"; // Ensure googleProvider is exported from firebase.js
import { doc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import toast from "react-hot-toast";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState({
    cart: [],
    wishlist: [],
    profile: {},
  });
  const [loading, setLoading] = useState(true);

  // Sync with Firestore in real-time
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUserData(doc.data());
          } else {
            const initialData = {
              cart: [],
              wishlist: [],
              profile: { firstName: "", lastName: "", phone: "" },
            };
            setDoc(userDocRef, initialData);
            setUserData(initialData);
          }
        });
      } else {
        // Reset local data on logout
        setUserData({ cart: [], wishlist: [], profile: {} });
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Generic helper for updating database
  const updateFirebase = async (newData) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, "users", currentUser.uid), newData);
    } catch (error) {
      console.error("Firestore Update Error:", error);
    }
  };

  // --- Auth Functions ---
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);
  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);
  const googleLogin = () => signInWithPopup(auth, googleProvider);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);
  const logout = () => signOut(auth);

  // --- Database Actions with Toast logic ---
  const addToCart = async (product, selectedColor = null) => {
    if (!currentUser) {
      toast.error("Please login to add items to your bag");
      return;
    }

    let newCart = [...userData.cart];
    const existingIndex = newCart.findIndex(
      (item) => item.id === product.id && item.color === selectedColor
    );

    if (existingIndex > -1) {
      newCart[existingIndex].qty += 1;
    } else {
      newCart.push({ ...product, qty: 1, color: selectedColor });
    }

    await updateFirebase({ cart: newCart });
    toast.success(`${product.name} added to Bag!`);
  };

  const updateCartQty = async (id, color, delta) => {
    if (!currentUser) return;
    let newCart = userData.cart
      .map((item) => {
        if (item.id === id && item.color === color) {
          return { ...item, qty: item.qty + delta };
        }
        return item;
      })
      .filter((item) => item.qty > 0);

    await updateFirebase({ cart: newCart });
  };

  const removeFromCart = async (id, color) => {
    if (!currentUser) return;
    const newCart = userData.cart.filter(
      (item) => !(item.id === id && item.color === color)
    );
    await updateFirebase({ cart: newCart });
    toast.error("Removed from Bag");
  };

  // const addToWishlist = async (product) => {
  //   if (!currentUser) {
  //     toast.error("Please login to save to wishlist");
  //     return;
  //   }

  //   if (userData.wishlist.some((item) => item.id === product.id)) {
  //     toast.error("Already in Wishlist");
  //     return;
  //   }

  //   const newWishlist = [...userData.wishlist, product];
  //   await updateFirebase({ wishlist: newWishlist });
  //   toast.success("Added to Wishlist");
  // };

  const addToWishlist = async (product) => {
    if (!currentUser) {
      toast.error("Please login to save to wishlist");
      return;
    }

    const isAlreadyInWishlist = userData.wishlist.some(
      (item) => item.id === product.id
    );

    let newWishlist;
    if (isAlreadyInWishlist) {
      // Logic for TOGGLE OFF: Remove from wishlist
      newWishlist = userData.wishlist.filter((item) => item.id !== product.id);
      await updateFirebase({ wishlist: newWishlist });
      toast.error("Removed from Wishlist"); // Feedback for removal
    } else {
      // Logic for TOGGLE ON: Add to wishlist
      newWishlist = [...userData.wishlist, product];
      await updateFirebase({ wishlist: newWishlist });
      toast.success("Added to Wishlist");
    }
  };

  const moveWishlistToCart = async (item) => {
    if (!currentUser) return;
    const newWishlist = userData.wishlist.filter((w) => w.id !== item.id);
    const existingInCart = userData.cart.find((c) => c.id === item.id);

    let newCart = [...userData.cart];
    if (existingInCart) {
      newCart = newCart.map((c) =>
        c.id === item.id ? { ...c, qty: c.qty + 1 } : c
      );
    } else {
      newCart.push({
        ...item,
        qty: 1,
        color: item.colors ? item.colors[0] : null,
      });
    }

    await updateFirebase({ wishlist: newWishlist, cart: newCart });
    toast.success("Moved to Bag");
  };

  const moveToWishlistFromCart = async (item) => {
    if (!currentUser) return;
    const newCart = userData.cart.filter(
      (c) => !(c.id === item.id && c.color === item.color)
    );

    // Only add if not already in wishlist
    let newWishlist = [...userData.wishlist];
    if (!newWishlist.some((w) => w.id === item.id)) {
      newWishlist.push(item);
    }

    await updateFirebase({ cart: newCart, wishlist: newWishlist });
    toast.success("Moved to Wishlist");
  };

  const value = {
    currentUser,
    userData,
    login,
    signup,
    googleLogin,
    resetPassword,
    logout,
    addToCart,
    updateCartQty,
    removeFromCart,
    addToWishlist, 
    moveWishlistToCart,
    moveToWishlistFromCart,
    updateFirebase, 
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
