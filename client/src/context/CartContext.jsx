
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "visionforge-cart";

function getSavedCart() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(CART_STORAGE_KEY)
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function getStockLimit(product) {
  if (
    product.stock === undefined ||
    product.stock === null ||
    product.stock === ""
  ) {
    return Infinity;
  }

  return Math.max(0, Number(product.stock) || 0);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getSavedCart);

  // Prevent duplicate builds during rapid clicks.
  const buildKeysRef = useRef(null);

  if (buildKeysRef.current === null) {
    buildKeysRef.current = new Set(
      cartItems
        .filter((item) => item.buildKey)
        .map((item) => item.buildKey)
    );
  }

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems)
      );
    } catch {
      // Keep the cart usable if browser storage is unavailable.
    }
  }, [cartItems]);

  // Add a normal product or increase its quantity.
  const addToCart = (product, quantity = 1) => {
    if (!product || product.id == null) {
      return false;
    }

    const requestedQuantity = Math.max(
      1,
      Math.floor(Number(quantity) || 1)
    );

    const stockLimit = getStockLimit(product);

    if (stockLimit < 1) {
      return false;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => String(item.id) === String(product.id)
      );

      if (existingItem) {
        const currentQuantity = Math.max(
          1,
          Number(existingItem.quantity) || 1
        );

        return currentItems.map((item) =>
          String(item.id) === String(product.id)
            ? {
                ...item,
                ...product,
                quantity: Math.min(
                  currentQuantity + requestedQuantity,
                  stockLimit
                ),
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity: Math.min(requestedQuantity, stockLimit),
        },
      ];
    });

    return true;
  };

  // Add one complete custom PC build only once.
  const addBuildToCart = (buildKey, parts) => {
    if (
      !buildKey ||
      !Array.isArray(parts) ||
      parts.length !== 7 ||
      parts.some(
        (part) =>
          !part ||
          part.id == null ||
          !Number.isFinite(Number(part.price))
      )
    ) {
      return false;
    }

    if (
      buildKeysRef.current.has(buildKey) ||
      cartItems.some((item) => item.buildKey === buildKey)
    ) {
      return false;
    }

    // Lock immediately to prevent rapid duplicate clicks.
    buildKeysRef.current.add(buildKey);

    setCartItems((currentItems) => {
      if (
        currentItems.some((item) => item.buildKey === buildKey)
      ) {
        return currentItems;
      }

      return [
        ...currentItems,
        ...parts.map((part) => ({
          ...part,
          buildKey,
          quantity: 1,
          isCustomBuildPart: true,
        })),
      ];
    });

    return true;
  };

  // Update normal product quantities only.
  const updateQuantity = (id, quantity) => {
    const requestedQuantity = Math.floor(Number(quantity) || 1);

    setCartItems((currentItems) =>
      currentItems
        .map((item) => {
          if (String(item.id) !== String(id)) {
            return item;
          }

          // Custom PC builds are fixed configurations.
          if (item.isCustomBuildPart) {
            return item;
          }

          const stockLimit = getStockLimit(item);

          return {
            ...item,
            quantity: Math.min(
              Math.max(1, requestedQuantity),
              stockLimit
            ),
          };
        })
        .filter((item) => getStockLimit(item) > 0)
    );
  };

  // Remove one normal product or an entire custom PC build.
  const removeFromCart = (id) => {
    const target = cartItems.find(
      (item) => String(item.id) === String(id)
    );

    if (!target) {
      return;
    }

    if (target.isCustomBuildPart && target.buildKey) {
      const buildKey = target.buildKey;

      // Update the duplicate guard outside the state updater.
      buildKeysRef.current.delete(buildKey);

      setCartItems((currentItems) =>
        currentItems.filter(
          (item) => item.buildKey !== buildKey
        )
      );

      return;
    }

    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => String(item.id) !== String(id)
      )
    );
  };

  // Empty the entire cart.
  const clearCart = () => {
    buildKeysRef.current.clear();
    setCartItems([]);
  };

  // Count a complete custom PC build as one item.
  const cartCount = (() => {
    const countedBuilds = new Set();

    return cartItems.reduce((count, item) => {
      if (item.isCustomBuildPart && item.buildKey) {
        if (countedBuilds.has(item.buildKey)) {
          return count;
        }

        countedBuilds.add(item.buildKey);
        return count + 1;
      }

      return count + (Number(item.quantity) || 1);
    }, 0);
  })();

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total +
      (Number(item.price) || 0) *
        (Number(item.quantity) || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        addBuildToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}
