"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { wishlistApi } from "@/lib/api";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [savedPropertyIds, setSavedPropertyIds] = useState(new Set());
  const [isWishlistLoading, setIsWishlistLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await wishlistApi.getWishlist();
      if (res?.success) {
        const ids = res.data.map(item => item.propertyId);
        setSavedPropertyIds(new Set(ids));
      }
    } catch (err) {
      console.error("Failed to fetch wishlist:", err.message);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in (you can optimize this to only run if auth token exists)
    // Here we just attempt to fetch, if it fails due to auth it fails gracefully.
    fetchWishlist();
  }, []);

  const toggleSavedProperty = async (propertyId) => {
    // Optimistic UI update
    const previousState = new Set(savedPropertyIds);
    const newState = new Set(savedPropertyIds);
    let isAdding = true;

    if (newState.has(propertyId)) {
      newState.delete(propertyId);
      isAdding = false;
    } else {
      newState.add(propertyId);
    }
    
    setSavedPropertyIds(newState);

    try {
      const res = await wishlistApi.toggleWishlist(propertyId);
      if (!res?.success) {
        // Revert if backend failed
        setSavedPropertyIds(previousState);
        throw new Error(res?.message || "Failed to toggle wishlist");
      }
    } catch (err) {
      // Revert if network error
      setSavedPropertyIds(previousState);
      throw err; // Re-throw to be handled by caller (e.g. show toast/login prompt)
    }
    return isAdding;
  };

  return (
    <WishlistContext.Provider value={{ savedPropertyIds, toggleSavedProperty, isWishlistLoading, refreshWishlist: fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
