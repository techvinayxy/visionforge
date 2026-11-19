
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import products from "../data/products";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "visionforge-cart";
const MAX_CART_QUANTITY = 99;

function getSavedCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
    if (!Array.isArray(saved)) return [];

    // Reconcile persisted cart entries with the current catalogue so older
    // saved carts inherit authoritative stock values and quantities are clamped.
    return saved
      .map((item) => {
        if (item.isCustomBuildPart) return item;

        const catalogueProduct = products.find(
          (product) => String(product.id) === String(item.id ?? item._id)
        );
        if (!catalogueProduct) return item;

        const stock = Number(catalogueProduct.stock);
        const stockLimit = Number.isFinite(stock)
          ? Math.min(MAX_CART_QUANTITY, Math.max(0, Math.floor(stock)))
          : MAX_CART_QUANTITY;

        return {
          ...item,
          ...catalogueProduct,
          ...item,
          stock: catalogueProduct.stock,
          quantity: Math.min(
            Math.max(1, Math.floor(Number(item.quantity) || 1)),
            stockLimit
          ),
        };
      })
      .filter(
        (item) =>
          item.isCustomBuildPart ||
          item.stock === undefined ||
          item.stock === null ||
          item.stock === "" ||
          Number(item.stock) > 0
      );
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
    return MAX_CART_QUANTITY;
  }

  const stock = Number(product.stock);
  return Number.isFinite(stock)
    ? Math.min(MAX_CART_QUANTITY, Math.max(0, Math.floor(stock)))
    : MAX_CART_QUANTITY;
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getSavedCart);
  const buildKeysRef = useRef(null);

  if (buildKeysRef.current === null) {
    buildKeysRef.current = new Set(
      cartItems.filter((item) => item.buildKey).map((item) => item.buildKey)
    );
  }

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Keep the cart usable if browser storage is unavailable.
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product || product.id == null) return false;

    const requestedQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
    const stockLimit = getStockLimit(product);
    if (stockLimit < 1) return false;

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => String(item.id) === String(product.id)
      );
      const effectiveStockLimit = Math.min(
        stockLimit,
        existingItem ? getStockLimit(existingItem) : MAX_CART_QUANTITY
      );
      if (effectiveStockLimit < 1) return currentItems;

      if (existingItem) {
        const currentQuantity = Math.max(1, Number(existingItem.quantity) || 1);
        return currentItems.map((item) =>
          String(item.id) === String(product.id)
            ? {
                ...item,
                ...product,
                quantity: Math.min(
                  currentQuantity + requestedQuantity,
                  effectiveStockLimit
                ),
              }
            : item
        );
      }

      return [
        ...currentItems,
        { ...product, quantity: Math.min(requestedQuantity, stockLimit) },
      ];
    });

    return true;
  };

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

    buildKeysRef.current.add(buildKey);
    setCartItems((currentItems) => {
      if (currentItems.some((item) => item.buildKey === buildKey)) {
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

  const updateQuantity = (id, quantity) => {
    const requestedQuantity = Math.floor(Number(quantity) || 1);

    setCartItems((currentItems) =>
      currentItems
        .map((item) => {
          if (String(item.id) !== String(id) || item.isCustomBuildPart) {
            return item;
          }

          const stockLimit = getStockLimit(item);
          if (stockLimit < 1) return item;

          return {
            ...item,
            quantity: Math.min(
              Math.max(1, requestedQuantity),
              stockLimit,
              MAX_CART_QUANTITY
            ),
          };
        })
        .filter((item) => item.isCustomBuildPart || getStockLimit(item) > 0)
    );
  };

  const removeFromCart = (id) => {
    const target = cartItems.find((item) => String(item.id) === String(id));
    if (!target) return;

    if (target.isCustomBuildPart && target.buildKey) {
      const buildKey = target.buildKey;
      buildKeysRef.current.delete(buildKey);
      setCartItems((currentItems) =>
        currentItems.filter((item) => item.buildKey !== buildKey)
      );
      return;
    }

    setCartItems((currentItems) =>
      currentItems.filter((item) => String(item.id) !== String(id))
    );
  };

  const clearCart = () => {
    buildKeysRef.current.clear();
    setCartItems([]);
  };

  const cartCount = (() => {
    const countedBuilds = new Set();
    return cartItems.reduce((count, item) => {
      if (item.isCustomBuildPart && item.buildKey) {
        if (countedBuilds.has(item.buildKey)) return count;
        countedBuilds.add(item.buildKey);
        return count + 1;
      }
      return count + (Number(item.quantity) || 1);
    }, 0);
  })();

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + (Number(item.price) || 0) * (Number(item.quantity) || 1),
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
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
