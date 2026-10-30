"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { wishlistApi } from "@/lib/api";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [savedPropertyIds, setSavedPropertyIds] = useState(new Set());
  const [isWishlistLoading, setIsWishlistLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    try {
      const res = await wishlistApi.getWishlist();
      if (res?.success) {
        const ids = res.data.map(item => item.propertyId);
        setSavedPropertyIds(new Set(ids));
      }
    } catch (err) {
      if (!err.message?.includes('Not authorized') && !err.message?.includes('401')) {
        console.error("Failed to fetch wishlist:", err.message);
      }
    } finally {
      setIsWishlistLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

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
