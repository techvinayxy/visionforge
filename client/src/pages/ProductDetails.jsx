import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import products from "../data/products";

function ProductDetails() {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

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

  const images = product.images || [product.image];

  const increaseQuantity = () => {
    if (quantity < (product.stock || 1)) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="product-details-page">
      <div className="product-details-container">

        {/* Back */}
        <Link to="/products" className="back-products">
          ← Back to Products
        </Link>

        {/* Main Product Section */}
        <div className="product-details-main">

          {/* Images */}
          <div className="product-gallery">

            <div className="product-thumbnails">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={
                    selectedImage === index
                      ? "thumbnail active"
                      : "thumbnail"
                  }
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                  />
                </button>
              ))}
            </div>

            <div className="product-main-image">
              <img
                src={images[selectedImage]}
                alt={product.name}
              />
            </div>

          </div>

          {/* Product Information */}
          <div className="product-details-info">

            <span className="product-details-category">
              {product.category}
            </span>

            <h1>{product.name}</h1>

            <div className="product-rating">
              <span className="rating-badge">
                ★ {product.rating}
              </span>

              <span>
                {product.reviews} Reviews
              </span>
            </div>

            <div className="product-price-section">

              <span className="product-details-price">
                ₹{product.price.toLocaleString("en-IN")}
              </span>

              {product.originalPrice && (
                <>
                  <span className="product-original-price">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
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
                {(product.originalPrice - product.price).toLocaleString(
                  "en-IN"
                )}
              </p>
            )}

            {/* Stock */}
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

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="quantity-section">
                <span>Quantity:</span>

                <div className="quantity-control">
                  <button onClick={decreaseQuantity}>
                    −
                  </button>

                  <span>{quantity}</span>

                  <button onClick={increaseQuantity}>
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="product-actions">

              <button
                className="add-cart-large"
                disabled={product.stock === 0}
              >
                🛒 Add to Cart
              </button>

              <button
                className="buy-now-btn"
                disabled={product.stock === 0}
              >
                Buy Now
              </button>

              <button className="wishlist-btn">
                ♡
              </button>

            </div>

            {/* Delivery */}
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

            {/* Warranty */}
            <div className="product-policy">

              <div>
                <strong>Warranty</strong>
                <span>{product.warranty}</span>
              </div>

              <div>
                <strong>Returns</strong>
                <span>{product.returnPolicy}</span>
              </div>

              <div>
                <strong>SKU</strong>
                <span>{product.sku}</span>
              </div>

            </div>

          </div>
        </div>

        {/* Description */}
        <section className="product-section">

          <h2>Product Description</h2>

          <p>{product.description}</p>

        </section>

        {/* Specifications */}
        <section className="product-section">

          <h2>Key Specifications</h2>

          <div className="specifications-grid">

            {Object.entries(product.specifications || {}).map(
              ([key, value]) => (
                <div className="specification-item" key={key}>
                  <span>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) =>
                        str.toUpperCase()
                      )}
                  </span>

                  <strong>{value}</strong>
                </div>
              )
            )}

          </div>

        </section>

        {/* Features */}
        <section className="product-section">

          <h2>Key Features</h2>

          <div className="features-grid">

            {(product.features || []).map(
              (feature, index) => (
                <div className="feature-item" key={index}>
                  ✓ {feature}
                </div>
              )
            )}

          </div>

        </section>

        {/* What's in the Box */}
        <section className="product-section">

          <h2>What's in the Box</h2>

          <ul className="box-contents">

            {(product.whatsInTheBox || []).map(
              (item, index) => (
                <li key={index}>✓ {item}</li>
              )
            )}

          </ul>

        </section>

        {/* Seller */}
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
                <span>
                  ⭐ {product.seller.rating}
                </span>

                <span>
                  📍 {product.seller.location}
                </span>
              </div>

            </div>

          </section>
        )}

        {/* Reviews */}
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

