
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems = [],
    cartCount = 0,
    cartTotal = 0,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const formatPrice = (price) => {
    const amount = Number(price) || 0;

    return `₹${amount.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  // Handle an empty cart
  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-container cart-empty">
          <h1>Your Cart Is Empty</h1>

          <p>
            Explore our products and find something you love.
          </p>

          <Link
            to="/products"
            className="cart-continue-btn"
          >
            Explore Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-container">
        <Link
          to="/products"
          className="back-products"
        >
          ← Continue Shopping
        </Link>

        <h1 className="cart-heading">
          Shopping Cart
        </h1>

        <p className="cart-subheading">
          {cartCount} item{cartCount !== 1 ? "s" : ""} in your cart
        </p>

        <div className="cart-layout">
          {/* Cart Items */}
          <section
            className="cart-items"
            aria-label="Items in your cart"
          >
            {cartItems.map((item) => {
              const itemId = item.id ?? item._id;
              const quantity = Math.max(
                1,
                Number(item.quantity) || 1
              );
              const price = Number(item.price) || 0;

              // If stock is not provided, allow quantity changes.
              const stockValue = Number(item.stock);
              const hasStockLimit =
                item.stock !== undefined &&
                item.stock !== null &&
                item.stock !== "";

              const maxStock = hasStockLimit
                ? Math.max(0, stockValue)
                : Infinity;

              const image =
                item.images?.[0] || item.image || "";

              return (
                <article
                  className="cart-item"
                  key={itemId}
                >
                  <Link
                    to={`/products/${itemId}`}
                    className="cart-item-image"
                    aria-label={`View ${item.name}`}
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

                    <Link
                      to={`/products/${itemId}`}
                      className="cart-item-name"
                    >
                      {item.name || "Unnamed Product"}
                    </Link>

                    <p className="cart-item-price">
                      {formatPrice(price)}
                    </p>

                    <div className="cart-item-actions">
                      <div
                        className="cart-quantity"
                        aria-label={`Quantity: ${quantity}`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(itemId, quantity - 1)
                          }
                          disabled={quantity <= 1}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          −
                        </button>

                        <span>{quantity}</span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(itemId, quantity + 1)
                          }
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
            })}
          </section>

          {/* Order Summary */}
          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="cart-summary-row">
              <span>Items ({cartCount})</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>

            <div className="cart-summary-row">
              <span>Delivery</span>
              <span className="cart-free-delivery">
                FREE
              </span>
            </div>

            <div className="cart-summary-total">
              <span>Total</span>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>

            <button
              type="button"
              className="cart-checkout-btn"
              onClick={() =>
                alert(
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
      </div>
    </main>
  );
}

export default Cart;
