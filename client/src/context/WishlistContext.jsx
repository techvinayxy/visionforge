import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext(null);
const STORAGE_KEY = "visionforge-wishlist";

function readWishlist() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(readWishlist);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Keep wishlist usable when browser storage is unavailable.
    }
  }, [items]);

  const isWishlisted = (id) => items.some((item) => String(item.id) === String(id));

  const toggleWishlist = (product) => {
    if (!product || product.id == null) return;
    setItems((current) =>
      current.some((item) => String(item.id) === String(product.id))
        ? current.filter((item) => String(item.id) !== String(product.id))
        : [...current, product]
    );
  };

  const removeFromWishlist = (id) => {
    setItems((current) => current.filter((item) => String(item.id) !== String(id)));
  };

  return (
    <WishlistContext.Provider value={{ items, count: items.length, isWishlisted, toggleWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
}
