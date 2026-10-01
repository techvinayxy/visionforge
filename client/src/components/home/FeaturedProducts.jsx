import { Link } from "react-router-dom";

function FeaturedProducts() {
  const products = [
    {
      name: "VISIONFORGE Gaming PC",
      category: "Gaming PC",
      price: "₹89,999",
      rating: "4.8",
      image: "/products/gaming-pc.jpg",
    },
    {
      name: "RTX Gaming Graphics Card",
      category: "PC Component",
      price: "₹54,999",
      rating: "4.7",
      image: "/products/graphics-card.jpg",
    },
    {
      name: "Performance Gaming Laptop",
      category: "Laptop",
      price: "₹74,999",
      rating: "4.6",
      image: "/products/gaming-laptop.jpg",
    },
    {
      name: "NextGen Smartphone",
      category: "Mobile",
      price: "₹39,999",
      rating: "4.5",
      image: "/products/smartphone.jpg",
    },
  ];

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
            <div className="product-card" key={product.name}>

              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.name}
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
                  <strong>{product.price}</strong>

                  <button>Add to Cart</button>
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