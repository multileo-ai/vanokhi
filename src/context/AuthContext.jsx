import React, { useContext, useState, useEffect } from "react";
import { auth, db, googleProvider } from "../firebase";
import {
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
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
  const [liveProducts, setLiveProducts] = useState([]);
  const [liveCollections, setLiveCollections] = useState([]);
  const [userData, setUserData] = useState({
    cart: [],
    wishlist: [],
    profile: {},
    isAdmin: false,
  });
  const [loading, setLoading] = useState(true);

  // 1. Sync Products, Collections, and Auth in Real-time
  useEffect(() => {
    let unsubProds = () => { };
    let unsubColls = () => { };
    let unsubUserDoc = () => { };

    // Listener for Auth State and User Profile
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      // Cleanup previous listeners
      unsubUserDoc();
      unsubProds();
      unsubColls();

      if (user) {
        // User is logged in
        const userDocRef = doc(db, "users", user.uid);

        unsubUserDoc = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setUserData(docSnap.data());
            } else {
              const initialData = {
                cart: [],
                wishlist: [],
                profile: { firstName: "", lastName: "", phone: "" },
                isAdmin: false,
              };
              setDoc(userDocRef, initialData);
              setUserData(initialData);
            }
          },
          (error) => {
            console.warn(
              "User profile listener blocked or failed:",
              error.message
            );
          }
        );

        // Fetch Products (Only if logged in to avoid permission errors)
        unsubProds = onSnapshot(
          collection(db, "products"),
          (snapshot) => {
            const prods = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setLiveProducts(prods);
          },
          (error) => {
            console.error("Error fetching products:", error);
          }
        );

        // Fetch Collections (Only if logged in)
        unsubColls = onSnapshot(
          collection(db, "collections"),
          (snapshot) => {
            const colls = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setLiveCollections(colls);
          },
          (error) => {
            console.error("Error fetching collections:", error);
          }
        );
      } else {
        // User is logged out
        setUserData({ cart: [], wishlist: [], profile: {}, isAdmin: false });
        setLiveProducts([]);
        setLiveCollections([]);
      }
      setLoading(false);
    });

    return () => {
      unsubAuth();
      unsubProds();
      unsubColls();
      unsubUserDoc();
    };
  }, []);

  // Generic helper for updating the current user's document
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
  const googleLogin = () => signInWithPopup(auth, googleProvider); // Removed Capacitor logic here
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);
  const logout = () => signOut(auth);

  // --- Cart Logic (Toggle & Increment) ---
  const addToCart = async (
    product,
    selectedSize = "M",
    selectedColor = null,
  ) => {
    if (!currentUser) {
      toast.error("Please login to add items to your bag");
      return;
    }

    if (product.stock <= 0) {
      toast.error("Sorry, this item is currently sold out!");
      return;
    }

    let newCart = [...(userData.cart || [])];

    const existingIndex = newCart.findIndex(
      (item) =>
        item.id === product.id &&
        item.color === selectedColor &&
        item.size === selectedSize,
    );

    if (existingIndex > -1) {
      const currentQtyInCart = newCart[existingIndex].qty;
      if (currentQtyInCart + 1 > product.stock) {
        toast.warning(`Only ${product.stock} items available.`);
        return;
      }
      newCart[existingIndex].qty += 1;
    } else {
      newCart.push({
        ...product,
        qty: 1,
        color: selectedColor,
        size: selectedSize,
      });
    }

    try {
      await updateFirebase({ cart: newCart });
      toast.success(`${product.name} (${selectedSize}) added to Bag!`);
    } catch (error) {
      console.error("Cart Update Error:", error);
    }
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
      (item) => !(item.id === id && item.color === color),
    );
    await updateFirebase({ cart: newCart });
    toast.error("Removed from Bag");
  };

  // --- Wishlist Logic (Toggles Heart Red/Empty) ---
  const addToWishlist = async (product) => {
    if (!currentUser) {
      toast.error("Please login to save to wishlist");
      return;
    }

    const isAlreadyInWishlist = (userData.wishlist || []).some(
      (item) => item.id === product.id,
    );

    let newWishlist;
    if (isAlreadyInWishlist) {
      newWishlist = userData.wishlist.filter((item) => item.id !== product.id);
      await updateFirebase({ wishlist: newWishlist });
      toast.error("Removed from Wishlist");
    } else {
      newWishlist = [...(userData.wishlist || []), product];
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
        c.id === item.id ? { ...c, qty: c.qty + 1 } : c,
      );
    } else {
      newCart.push({
        ...item,
        qty: 1,
        color: item.colors ? item.colors[0] : null,
        size: "M", // Standardized to default size
      });
    }

    await updateFirebase({ wishlist: newWishlist, cart: newCart });
    toast.success("Moved to Bag");
  };

  const moveToWishlistFromCart = async (item) => {
    if (!currentUser) return;

    const newCart = userData.cart.filter(
      (c) => !(c.id === item.id && c.color === item.color),
    );

    const isAlreadyInWishlist = (userData.wishlist || []).some(
      (w) => w.id === item.id,
    );

    let newWishlist = [...(userData.wishlist || [])];
    if (!isAlreadyInWishlist) {
      const { qty, ...productData } = item;
      newWishlist.push(productData);
    }

    await updateFirebase({ cart: newCart, wishlist: newWishlist });
    toast.success("Moved to Wishlist");
  };

  const createOrder = async (orderData) => {
    if (!currentUser) return;
    try {
      const orderNumber = `VK-${new Date().getFullYear()}-${Math.floor(
        1000 + Math.random() * 9000,
      )}`;
      const orderRef = await addDoc(collection(db, "orders"), {
        ...orderData,
        orderNumber: orderNumber,
        userId: currentUser.uid,
        customerEmail: currentUser.email,
        customerName:
          `${userData.profile.firstName || ""} ${userData.profile.lastName || ""
            }`.trim() ||
          currentUser.displayName ||
          "Valued Customer",
        status: "Order Placed",
        createdAt: serverTimestamp(),
        totalAmount: orderData.total || orderData.totalAmount,
      });

      await updateFirebase({ cart: [] });

      return { id: orderRef.id, orderNumber };
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userData,
    liveProducts,
    liveCollections,
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
    createOrder,
    updateFirebase,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}