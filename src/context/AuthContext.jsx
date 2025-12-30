// src/context/AuthContext.jsx
import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
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
            // Initialize new user data
            const initialData = {
              cart: [],
              wishlist: [],
              profile: {
                firstName: "",
                lastName: "",
                phone: "",
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                pinCode: "",
                landmark: "",
              },
            };
            setDoc(userDocRef, initialData);
            setUserData(initialData);
          }
        });
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const updateFirebase = async (newData) => {
    if (!currentUser) return;
    await updateDoc(doc(db, "users", currentUser.uid), newData);
  };

  const addToCart = async (product, selectedColor = null) => {
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
    toast.success("Added to Bag");
  };

  const updateCartQty = async (id, color, delta) => {
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
    const newCart = userData.cart.filter(
      (item) => !(item.id === id && item.color === color)
    );
    await updateFirebase({ cart: newCart });
    toast.error("Removed from Bag");
  };

  const addToWishlist = async (product) => {
    if (userData.wishlist.some((item) => item.id === product.id)) {
      toast.error("Already in Wishlist");
      return;
    }
    const newWishlist = [...userData.wishlist, product];
    await updateFirebase({ wishlist: newWishlist });
    toast.success("Added to Wishlist");
  };

  const moveWishlistToCart = async (item) => {
    // Remove from wishlist
    const newWishlist = userData.wishlist.filter((w) => w.id !== item.id);
    await updateFirebase({ wishlist: newWishlist });
    // Add to cart
    await addToCart(item, item.colors ? item.colors[0] : null);
    toast.success("Moved to Bag");
  };

  const moveToWishlistFromCart = async (item) => {
    await removeFromCart(item.id, item.color);
    await addToWishlist(item);
    toast.success("Moved to Wishlist");
  };

  const logout = () => signOut(auth);

  const value = {
    currentUser,
    userData,
    addToCart,
    updateCartQty,
    removeFromCart,
    addToWishlist,
    moveWishlistToCart,
    moveToWishlistFromCart,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
