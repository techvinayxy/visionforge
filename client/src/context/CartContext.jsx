import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "visionforge-cart";

function getSavedCart() {
  try {
    const savedCart = JSON.parse(
      localStorage.getItem(CART_STORAGE_KEY)
    );

    return Array.isArray(savedCart) ? savedCart : [];
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

  useEffect(() => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  // Add a product or increase its existing quantity.
  const addToCart = (product, quantity = 1) => {
    if (!product || product.id === undefined || product.id === null) {
      return;
    }

    const requestedQuantity = Math.max(
      1,
      Math.floor(Number(quantity) || 1)
    );

    const stockLimit = getStockLimit(product);

    if (stockLimit < 1) {
      return;
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
  };

  // Change the quantity of an existing cart product.
  const updateQuantity = (id, quantity) => {
    const requestedQuantity = Math.floor(Number(quantity) || 1);

    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (String(item.id) !== String(id)) {
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
      }).filter((item) => getStockLimit(item) > 0)
    );
  };

  // Remove a product completely.
  const removeFromCart = (id) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => String(item.id) !== String(id)
      )
    );
  };

  // Empty the cart.
  const clearCart = () => {
    setCartItems([]);
  };

  // Count unique products, not total units.
  const cartCount = cartItems.length;

  // Calculate the total price of all units.
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
