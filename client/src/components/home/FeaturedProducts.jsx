function FeaturedProducts() {
  const products = [
    {
      name: "VISIONFORGE Gaming PC",
      category: "Gaming PC",
      price: "₹89,999",
      rating: "4.8",
    },
    {
      name: "RTX Gaming Graphics Card",
      category: "PC Component",
      price: "₹54,999",
      rating: "4.7",
    },
    {
      name: "Performance Laptop Pro",
      category: "Laptop",
      price: "₹74,999",
      rating: "4.6",
    },
    {
      name: "NextGen Smartphone",
      category: "Mobile",
      price: "₹39,999",
      rating: "4.5",
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

          <button className="view-all-btn">
            View All Products →
          </button>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product.name}>
              <div className="product-image">
                <span>PRODUCT IMAGE</span>
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