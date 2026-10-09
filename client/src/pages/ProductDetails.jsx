
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import products from "../data/products";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const product = products.find((item) => item.id === Number(id));
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>The product you are looking for does not exist.</p>
        <Link to="/products">Back to Products</Link>
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : product.image
      ? [product.image]
      : [];

  const changeImage = (direction) => {
    setSelectedImage(
      (current) =>
        (current + direction + images.length) % images.length
    );
  };

  const increaseQuantity = () => {
    if (quantity < (product.stock || 1)) {
      setQuantity((current) => current + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((current) => current - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product.stock || quantity > product.stock) {
      alert("This product is currently out of stock.");
      return;
    }

    addToCart(
      {
        ...product,
        images,
      },
      quantity
    );

    alert(`${product.name} added to your cart!`);
  };

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <Link to="/products" className="back-products">
          ← Back to Products
        </Link>

        <div className="product-details-main">
          <div className="product-gallery">
            <div className="product-thumbnails">
              {images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  className={
                    selectedImage === index
                      ? "thumbnail active"
                      : "thumbnail"
                  }
                  onClick={() => setSelectedImage(index)}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={selectedImage === index}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                  />
                </button>
              ))}
            </div>

            <div className="product-main-image">
              {images.length > 1 && (
                <button
                  type="button"
                  className="gallery-arrow gallery-prev"
                  onClick={() => changeImage(-1)}
                  aria-label="Previous image"
                >
                  &#10094;
                </button>
              )}

              {images[selectedImage] && (
                <img
                  src={images[selectedImage]}
                  alt={`${product.name} - Image ${selectedImage + 1}`}
                />
              )}

              {images.length > 1 && (
                <button
                  type="button"
                  className="gallery-arrow gallery-next"
                  onClick={() => changeImage(1)}
                  aria-label="Next image"
                >
                  &#10095;
                </button>
              )}

              {images.length > 1 && (
                <span className="gallery-counter">
                  {selectedImage + 1} / {images.length}
                </span>
              )}
            </div>
          </div>

          <div className="product-details-info">
            <span className="product-details-category">
              {product.category}
            </span>

            <h1>{product.name}</h1>

            <div className="product-rating">
              <span className="rating-badge">
                ★ {product.rating}
              </span>
              <span>{product.reviews} Reviews</span>
            </div>

            <div className="product-price-section">
              <span className="product-details-price">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>

              {product.originalPrice && (
                <>
                  <span className="product-original-price">
                    ₹
                    {Number(product.originalPrice).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                  <span className="product-discount">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            {product.originalPrice && (
              <p className="product-savings">
                You save ₹
                {(
                  Number(product.originalPrice) -
                  Number(product.price)
                ).toLocaleString("en-IN")}
              </p>
            )}

            <div className="product-stock">
              {product.stock > 0 ? (
                <>
                  <span className="stock-dot"></span>
                  In Stock
                </>
              ) : (
                <span>Out of Stock</span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="quantity-section">
                <span>Quantity:</span>

                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="product-actions">
              <button
                type="button"
                className="add-cart-large"
                disabled={!product.stock}
                onClick={handleAddToCart}
              >
                🛒 Add to Cart
              </button>

              <button
                type="button"
                className="buy-now-btn"
                disabled={!product.stock}
              >
                Buy Now
              </button>

              <button
                type="button"
                className="wishlist-btn"
                aria-label="Add to wishlist"
              >
                ♡
              </button>
            </div>

            {product.delivery && (
              <div className="delivery-box">
                <h3>Delivery & Payment</h3>

                {product.delivery.freeDelivery && (
                  <p>✓ Free Delivery</p>
                )}

                {product.delivery.codAvailable && (
                  <p>✓ Cash on Delivery Available</p>
                )}

                <p>
                  ✓ Estimated delivery:{" "}
                  {product.delivery.estimatedDays}
                </p>
              </div>
            )}

            <div className="product-policy">
              <div>
                <strong>Warranty</strong>
                <span>{product.warranty || "Not specified"}</span>
              </div>

              <div>
                <strong>Returns</strong>
                <span>
                  {product.returnPolicy || "Not specified"}
                </span>
              </div>

              <div>
                <strong>SKU</strong>
                <span>{product.sku || "Not available"}</span>
              </div>
            </div>
          </div>
        </div>

        <section className="product-section">
          <h2>Product Description</h2>
          <p>
            {product.description ||
              "Product description coming soon."}
          </p>
        </section>

        <section className="product-section">
          <h2>Key Specifications</h2>

          <div className="specifications-grid">
            {Object.entries(product.specifications || {}).map(
              ([key, value]) => (
                <div className="specification-item" key={key}>
                  <span>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </span>
                  <strong>{value}</strong>
                </div>
              )
            )}
          </div>
        </section>

        <section className="product-section">
          <h2>Key Features</h2>

          <div className="features-grid">
            {(product.features || []).map((feature, index) => (
              <div className="feature-item" key={index}>
                ✓ {feature}
              </div>
            ))}
          </div>
        </section>

        <section className="product-section">
          <h2>What's in the Box</h2>

          <ul className="box-contents">
            {(product.whatsInTheBox || []).map((item, index) => (
              <li key={index}>✓ {item}</li>
            ))}
          </ul>
        </section>

        {product.seller && (
          <section className="product-section seller-section">
            <h2>Seller Information</h2>

            <div className="seller-card">
              <div>
                <h3>{product.seller.name}</h3>

                {product.seller.verified && (
                  <span className="verified-seller">
                    ✓ Verified Seller
                  </span>
                )}
              </div>

              <div className="seller-details">
                <span>⭐ {product.seller.rating}</span>
                <span>📍 {product.seller.location}</span>
              </div>
            </div>
          </section>
        )}

        <section className="product-section">
          <h2>Customer Reviews</h2>

          <div className="reviews-summary">
            <div className="review-score">
              <strong>{product.rating}</strong>
              <span>★</span>
              <p>{product.reviews} reviews</p>
            </div>

            <div className="review-message">
              Customer reviews and ratings will appear here.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProductDetails;