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
    // Real-time listener for Products
    const unsubProds = onSnapshot(collection(db, "products"), (snapshot) => {
      const prods = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLiveProducts(prods);
    });

    // Real-time listener for Collections
    const unsubColls = onSnapshot(collection(db, "collections"), (snapshot) => {
      const colls = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLiveCollections(colls);
    });

    // Listener for Auth State and User Profile
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        // Sync user profile, cart, wishlist, and admin status
        onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            // Initialize new user document in Firestore if it doesn't exist
            const initialData = {
              cart: [],
              wishlist: [],
              profile: { firstName: "", lastName: "", phone: "" },
              isAdmin: false,
            };
            setDoc(userDocRef, initialData);
            setUserData(initialData);
          }
        });
      } else {
        // Reset local data on logout
        setUserData({ cart: [], wishlist: [], profile: {}, isAdmin: false });
      }
      setLoading(false);
    });

    return () => {
      unsubProds();
      unsubColls();
      unsubAuth();
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
  const googleLogin = () => signInWithPopup(auth, googleProvider);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);
  const logout = () => signOut(auth);

  // --- Cart Logic (Toggle & Increment) ---
  // const addToCart = async (product, selectedColor = null) => {
  //   if (!currentUser) {
  //     toast.error("Please login to add items to your bag");
  //     return;
  //   }

  //   let newCart = [...(userData.cart || [])];
  //   const existingIndex = newCart.findIndex(
  //     (item) => item.id === product.id && item.color === selectedColor,
  //   );

  //   if (existingIndex > -1) {
  //     newCart[existingIndex].qty += 1;
  //   } else {
  //     newCart.push({ ...product, qty: 1, color: selectedColor });
  //   }

  //   await updateFirebase({ cart: newCart });
  //   toast.success(`${product.name} added to Bag!`);
  // };

  // const addToCart = async (product, selectedColor = null) => {
  //   if (!currentUser) {
  //     toast.error("Please login to add items to your bag");
  //     return;
  //   }

  //   // 1. Check if the product itself is out of stock before even looking at the cart
  //   if (product.stock <= 0) {
  //     toast.error("Sorry, this item is currently sold out!");
  //     return;
  //   }

  //   let newCart = [...(userData.cart || [])];
  //   const existingIndex = newCart.findIndex(
  //     (item) => item.id === product.id && item.color === selectedColor,
  //   );

  //   if (existingIndex > -1) {
  //     const currentQtyInCart = newCart[existingIndex].qty;

  //     // 2. Validation: Check if adding one more exceeds available stock
  //     if (currentQtyInCart + 1 > product.stock) {
  //       toast.warning(
  //         `Cannot add more! Only ${product.stock} items available in stock.`,
  //         {
  //           position: "top-right",
  //           autoClose: 3000,
  //         },
  //       );
  //       return; // Stop the function here
  //     }

  //     newCart[existingIndex].qty += 1;
  //   } else {
  //     // 3. For a new item, ensure at least 1 is available
  //     if (product.stock < 1) {
  //       toast.error("Item is out of stock.");
  //       return;
  //     }
  //     newCart.push({ ...product, qty: 1, color: selectedColor });
  //   }

  //   try {
  //     await updateFirebase({ cart: newCart });
  //     toast.success(`${product.name} added to Bag!`);
  //   } catch (error) {
  //     console.error("Cart Update Error:", error);
  //     toast.error("Failed to update bag. Please try again.");
  //   }
  // };

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

    // Update the check to include size so the same product in different sizes
    // appears as separate items in the bag
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
      // SAVE THE SIZE HERE
      newCart.push({
        ...product,
        qty: 1,
        color: selectedColor,
        size: selectedSize, // <--- This line is critical
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
        size: selectedSize,
      });
    }

    await updateFirebase({ wishlist: newWishlist, cart: newCart });
    toast.success("Moved to Bag");
  };

  const moveToWishlistFromCart = async (item) => {
    if (!currentUser) return;

    // 1. Remove from Cart
    const newCart = userData.cart.filter(
      (c) => !(c.id === item.id && c.color === item.color),
    );

    // 2. Add to Wishlist (check if it's already there first to avoid duplicates)
    const isAlreadyInWishlist = (userData.wishlist || []).some(
      (w) => w.id === item.id,
    );

    let newWishlist = [...(userData.wishlist || [])];
    if (!isAlreadyInWishlist) {
      // Strip cart-specific properties like 'qty' before adding to wishlist
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
      // 1. Add order to 'orders' collection
      const orderRef = await addDoc(collection(db, "orders"), {
        ...orderData,
        orderNumber: orderNumber,
        userId: currentUser.uid,
        customerEmail: currentUser.email,
        customerName:
          `${userData.profile.firstName || ""} ${
            userData.profile.lastName || ""
          }`.trim() ||
          currentUser.displayName ||
          "Valued Customer",
        status: "Order Placed",
        createdAt: serverTimestamp(),
        totalAmount: orderData.total || orderData.totalAmount,
      });

      // 2. Clear user's cart in Firebase
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
