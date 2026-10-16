
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Toast from "../components/common/Toast";

function Cart() {
  const {
    cartItems = [],
    cartCount = 0,
    cartTotal = 0,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [toast, setToast] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const showToast = useCallback((type, title, message) => {
    setToast({ id: Date.now(), type, title, message });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  const formatPrice = (price) =>
    `₹${(Number(price) || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  // Group the seven components of each custom PC build.
  const cartGroups = [];
  const processedBuilds = new Set();

  cartItems.forEach((item) => {
    if (item.isCustomBuildPart && item.buildKey) {
      if (processedBuilds.has(item.buildKey)) return;

      processedBuilds.add(item.buildKey);

      const parts = cartItems.filter(
        (part) =>
          part.isCustomBuildPart &&
          part.buildKey === item.buildKey
      );

      cartGroups.push({
        type: "build",
        key: item.buildKey,
        parts,
        total: parts.reduce(
          (sum, part) =>
            sum +
            (Number(part.price) || 0) *
              (Number(part.quantity) || 1),
          0
        ),
      });
    } else {
      cartGroups.push({
        type: "product",
        key: String(item.id ?? item._id),
        item,
      });
    }
  });

  function handleRemoveAll() {
    if (cartItems.length === 0) {
      showToast("warning", "Cart is empty", "Your cart is already empty.");
      setConfirmClear(false);
      return;
    }

    if (!confirmClear) {
      setConfirmClear(true);
      showToast(
        "warning",
        "Remove all items?",
        "Click Remove All again to empty your cart."
      );
      return;
    }

    if (typeof clearCart !== "function") {
      showToast(
        "error",
        "Unable to clear cart",
        "The clear-cart function is not available."
      );
      setConfirmClear(false);
      return;
    }

    clearCart();
    setConfirmClear(false);
    showToast("success", "Cart cleared", "All items removed from cart.");
  }

  function handleRemoveBuild(buildKey) {
    const buildParts = cartItems.filter(
      (item) =>
        item.isCustomBuildPart && item.buildKey === buildKey
    );

    if (buildParts.length === 0) return;

    // CartContext removes all components when any build part is removed.
    removeFromCart(buildParts[0].id);

    showToast(
      "success",
      "Build removed",
      "Your complete custom PC build has been removed from the cart."
    );
  }

  function renderProduct(item) {
    const itemId = item.id ?? item._id;
    const quantity = Math.max(1, Number(item.quantity) || 1);
    const price = Number(item.price) || 0;
    const hasStockLimit =
      item.stock !== undefined &&
      item.stock !== null &&
      item.stock !== "";
    const maxStock = hasStockLimit
      ? Math.max(0, Number(item.stock) || 0)
      : Infinity;
    const image = item.images?.[0] || item.image || "";

    return (
      <article className="cart-item" key={itemId}>
        <Link
          to={`/products/${itemId}`}
          className="cart-item-image"
          aria-label={`View ${item.name || "product"}`}
        >
          {image ? (
            <img
              src={image}
              alt={item.name || "Product"}
              loading="lazy"
            />
          ) : (
            <span>No image available</span>
          )}
        </Link>

        <div className="cart-item-details">
          <span className="cart-item-category">
            {item.category || "Product"}
          </span>

          <Link to={`/products/${itemId}`} className="cart-item-name">
            {item.name || "Unnamed Product"}
          </Link>

          <p className="cart-item-price">{formatPrice(price)}</p>

          <div className="cart-item-actions">
            <div
              className="cart-quantity"
              aria-label={`Quantity: ${quantity}`}
            >
              <button
                type="button"
                onClick={() => updateQuantity(itemId, quantity - 1)}
                disabled={quantity <= 1}
                aria-label={`Decrease quantity of ${item.name}`}
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={() => updateQuantity(itemId, quantity + 1)}
                disabled={quantity >= maxStock}
                aria-label={`Increase quantity of ${item.name}`}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="cart-remove-btn"
              onClick={() => removeFromCart(itemId)}
            >
              Remove
            </button>
          </div>
        </div>

        <strong className="cart-item-subtotal">
          {formatPrice(price * quantity)}
        </strong>
      </article>
    );
  }

  function renderBuild(group) {
    return (
      <article className="cart-item cart-build-item" key={group.key}>
        <div className="cart-item-image cart-build-image">
          <span>PC BUILD</span>
        </div>

        <div className="cart-item-details">
          <span className="cart-item-category">
            VISIONFORGE CUSTOM BUILD
          </span>

          <h3 className="cart-item-name">Your Custom PC Build</h3>

          <p className="cart-item-price">
            {group.parts.length} components selected
          </p>

          <ul className="cart-build-parts">
            {group.parts.map((part) => (
              <li key={part.id}>
                <span>
                  {part.buildCategory || "Component"}:{" "}
                  {part.name || "Unnamed component"}
                </span>
                <strong>{formatPrice(part.price)}</strong>
              </li>
            ))}
          </ul>

          <div className="cart-item-actions">
            <button
              type="button"
              className="cart-remove-btn"
              onClick={() => handleRemoveBuild(group.key)}
            >
              Remove build
            </button>
          </div>
        </div>

        <strong className="cart-item-subtotal">
          {formatPrice(group.total)}
        </strong>
      </article>
    );
  }

  return (
    <main className="cart-page">
      <Toast toast={toast} onClose={closeToast} />

      <div
        className={`cart-container ${
          cartItems.length === 0 ? "cart-empty" : ""
        }`}
      >
        {cartItems.length === 0 ? (
          <>
            <h1>Your Cart Is Empty</h1>
            <p>Explore our products and find something you love.</p>

            <div className="cart-empty-actions">
              <Link to="/products" className="cart-continue-btn">
                Explore Products
              </Link>
              <Link to="/builder" className="cart-continue-btn">
                Build Your PC
              </Link>
            </div>
          </>
        ) : (
          <>
            <Link to="/products" className="back-products">
              ← Continue Shopping
            </Link>

            <div className="cart-title-row">
              <div>
                <h1 className="cart-heading">Shopping Cart</h1>
                <p className="cart-subheading">
                  {cartCount} item{cartCount !== 1 ? "s" : ""} in your cart
                </p>
              </div>

              <button
                type="button"
                className="cart-remove-all-btn"
                onClick={handleRemoveAll}
              >
                {confirmClear ? "Confirm Remove All" : "Remove All"}
              </button>
            </div>

            <div className="cart-layout">
              <section className="cart-items" aria-label="Items in your cart">
                {cartGroups.map((group) =>
                  group.type === "build"
                    ? renderBuild(group)
                    : renderProduct(group.item)
                )}
              </section>

              <aside className="cart-summary">
                <h2>Order Summary</h2>

                <div className="cart-summary-row">
                  <span>Items ({cartCount})</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>

                <div className="cart-summary-row">
                  <span>Delivery</span>
                  <span className="cart-free-delivery">FREE</span>
                </div>

                <div className="cart-summary-total">
                  <span>Total</span>
                  <strong>{formatPrice(cartTotal)}</strong>
                </div>

                <button
                  type="button"
                  className="cart-checkout-btn"
                  onClick={() =>
                    showToast(
                      "warning",
                      "Checkout coming soon",
                      "Checkout functionality will be available in the next step."
                    )
                  }
                >
                  Proceed to Checkout
                </button>

                <p className="cart-secure-note">
                  Secure checkout coming soon.
                </p>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default Cart;
