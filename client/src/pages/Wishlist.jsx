import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useCart } from "../context/CartContext.jsx";

function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <main className="wishlist-page">
      <div className="wishlist-page-header">
        <div>
          <p className="wishlist-eyebrow">SAVED FOR LATER</p>
          <h1>My Wishlist <span>({items.length})</span></h1>
          <p>Keep the tech you love in one place.</p>
        </div>
        <Link to="/products" className="wishlist-continue">Explore Products</Link>
      </div>

      {items.length === 0 ? (
        <section className="wishlist-empty">
          <div className="wishlist-empty-heart">♡</div>
          <h2>Your wishlist is empty</h2>
          <p>Tap the heart on a product to save it here.</p>
          <Link to="/products" className="wishlist-continue">Browse Products</Link>
        </section>
      ) : (
        <div className="wishlist-grid">
          {items.map((product) => (
            <article className="wishlist-card" key={product.id}>
              <Link to={`/products/${product.id}`} className="wishlist-card-image">
                <img src={product.image || product.images?.[0] || ""} alt={product.name} />
              </Link>
              <div className="wishlist-card-info">
                <span>{product.category || "Technology"}</span>
                <Link to={`/products/${product.id}`} className="wishlist-product-name">{product.name}</Link>
                <strong>₹{Number(product.price || 0).toLocaleString("en-IN")}</strong>
                <div className="wishlist-card-actions">
                  <button type="button" onClick={() => addToCart({ ...product, images: product.images || (product.image ? [product.image] : []) }, 1)}>Add to Cart</button>
                  <button type="button" className="wishlist-remove" onClick={() => removeFromWishlist(product.id)} aria-label={`Remove ${product.name} from wishlist`}>♥ Remove</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default Wishlist;
