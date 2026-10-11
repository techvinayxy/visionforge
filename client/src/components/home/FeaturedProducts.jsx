
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";

function FeaturedProducts() {
  const { addToCart } = useCart();

  const products = [
    {
      id: 1,
      name: "VISIONFORGE Titan Gaming PC",
      category: "Gaming PCs",
      price: 89999,
      rating: "4.8",
      image:
        "https://res.cloudinary.com/cm0zg2bc/image/upload/v1790958993/Titan_Gaming_PC.png",
    },
    {
      id: 5,
      name: "RTX Gaming Graphics Card",
      category: "Graphics Cards",
      price: 54999,
      rating: "4.7",
      image:
        "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791011087/RTX_Gaming_Graphics_Card.jpg",
    },
    {
      id: 18,
      name: "VISIONFORGE Gaming Laptop",
      category: "Laptops",
      price: 74999,
      rating: "4.6",
      image:
        "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791527535/Gaming_Laptop.jpg",
    },
    {
      id: 20,
      name: "VISIONFORGE Performance Smartphone",
      category: "Mobiles",
      price: 39999,
      rating: "4.5",
      image:
        "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791528474/Performance_Smartphone.png",
    },
  ];

  const formatPrice = (price) =>
    `₹${price.toLocaleString("en-IN")}`;

  const handleAddToCart = (product) => {
    addToCart(
      {
        ...product,
        images: [product.image],
      },
      1
    );
  };

  return (
    <section className="featured-section">
      <div className="section-container">
        <div className="section-heading featured-heading">
          <div>
            <p>HANDPICKED FOR YOU</p>
            <h2>Featured Products</h2>
          </div>

          <Link to="/products" className="view-all-btn">
            View All Products →
          </Link>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <Link
                to={`/products/${product.id}`}
                className="product-card-link"
              >
                <div className="product-image">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                  />
                </div>

                <div className="product-info">
                  <p className="product-category">
                    {product.category}
                  </p>

                  <h3>{product.name}</h3>

                  <div className="product-rating">
                    ★ {product.rating}
                  </div>

                  <div className="product-bottom">
                    <strong>{formatPrice(product.price)}</strong>
                  </div>
                </div>
              </Link>

              <div className="product-info">
                <div className="product-bottom">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
