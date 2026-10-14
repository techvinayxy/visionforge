
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const CompareContext = createContext(null);
const STORAGE_KEY = "visionforge-compare-products";
const MAX_COMPARE = 3;

function readSavedProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_COMPARE) : [];
  } catch {
    return [];
  }
}

export function CompareProvider({ children }) {
  const [compareProducts, setCompareProducts] = useState(readSavedProducts);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(compareProducts)
      );
    } catch {
      // Comparison still works for the current session.
    }
  }, [compareProducts]);

  const addCompareProduct = useCallback((product) => {
    let result = { success: false, message: "" };

    setCompareProducts((current) => {
      if (current.some((item) => String(item.id) === String(product.id))) {
        result = {
          success: false,
          message: "Product is already in comparison.",
        };
        return current;
      }

      if (current.length >= MAX_COMPARE) {
        result = {
          success: false,
          message: "You can compare up to 3 products.",
        };
        return current;
      }

      if (
        current.length > 0 &&
        current[0].category !== product.category
      ) {
        result = {
          success: false,
          message: "Please select products from the same category.",
        };
        return current;
      }

      result = {
        success: true,
        message: "Product added to comparison.",
      };

      return [...current, product];
    });

    return result;
  }, []);

  const removeCompareProduct = useCallback((id) => {
    setCompareProducts((current) =>
      current.filter((item) => String(item.id) !== String(id))
    );
  }, []);

  const clearCompare = useCallback(() => {
    setCompareProducts([]);
  }, []);

  return (
    <CompareContext.Provider
      value={{
        compareProducts,
        addCompareProduct,
        removeCompareProduct,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);

  if (!context) {
    throw new Error("useCompare must be used within CompareProvider");
  }

  return context;
}
