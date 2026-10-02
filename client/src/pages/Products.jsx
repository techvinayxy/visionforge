function Products() {
  return (
    <div className="products-page">
      <div className="products-container">

        {/* Header */}
        <div className="products-header">
          <div>
            <h1>Products</h1>
            <p>Explore technology products.</p>
          </div>

          <div className="products-search">
            <input
              type="text"
              placeholder="Search products..."
            />
          </div>
        </div>

        {/* Categories */}
        <div className="products-categories">
          <button className="active">All</button>
          <button>Gaming PCs</button>
          <button>Graphics Cards</button>
          <button>Processors</button>
          <button>Motherboards</button>
          <button>RAM</button>
          <button>Storage</button>
          <button>Laptops</button>
          <button>Mobiles</button>
        </div>

        {/* Content */}
        <div className="products-content">

          {/* Sidebar */}
          <aside className="products-sidebar">
            <h3>Filters</h3>

            <div className="filter-section">
              <h4>Category</h4>

              <label>
                <input type="checkbox" />
                Gaming PCs
              </label>

              <label>
                <input type="checkbox" />
                Graphics Cards
              </label>

              <label>
                <input type="checkbox" />
                Processors
              </label>

              <label>
                <input type="checkbox" />
                RAM
              </label>

              <label>
                <input type="checkbox" />
                Storage
              </label>
            </div>

            <div className="filter-section">
              <h4>Price Range</h4>

              <label>
                <input type="checkbox" />
                Under ₹25,000
              </label>

              <label>
                <input type="checkbox" />
                ₹25,000 - ₹50,000
              </label>

              <label>
                <input type="checkbox" />
                ₹50,000 - ₹1,00,000
              </label>

              <label>
                <input type="checkbox" />
                Above ₹1,00,000
              </label>
            </div>
          </aside>

          {/* Products */}
          <main className="products-main">

            <div className="products-toolbar">
              <span>Featured Products</span>

              <select defaultValue="popular">
                <option value="popular">Sort: Popular</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            <div className="product-grid">

              {/* Product 1 */}
              <div className="product-card">
                <div className="product-image">
                  <span>GPU</span>
                </div>

                <div className="product-info">
                  <span className="product-category">
                    Graphics Card
                  </span>

                  <h3>Gaming Graphics Card</h3>

                  <p className="product-price">
                    ₹49,999
                  </p>

                  <button className="add-cart-btn">
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Product 2 */}
              <div className="product-card">
                <div className="product-image">
                  <span>CPU</span>
                </div>

                <div className="product-info">
                  <span className="product-category">
                    Processor
                  </span>

                  <h3>Performance CPU</h3>

                  <p className="product-price">
                    ₹32,999
                  </p>

                  <button className="add-cart-btn">
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Product 3 */}
              <div className="product-card">
                <div className="product-image">
                  <span>PC</span>
                </div>

                <div className="product-info">
                  <span className="product-category">
                    Gaming PC
                  </span>

                  <h3>VISIONFORGE Gaming PC</h3>

                  <p className="product-price">
                    ₹89,999
                  </p>

                  <button className="add-cart-btn">
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Product 4 */}
              <div className="product-card">
                <div className="product-image">
                  <span>LAPTOP</span>
                </div>

                <div className="product-info">
                  <span className="product-category">
                    Laptop
                  </span>

                  <h3>Gaming Laptop</h3>

                  <p className="product-price">
                    ₹74,999
                  </p>

                  <button className="add-cart-btn">
                    Add to Cart
                  </button>
                </div>
              </div>

            </div>

          </main>

        </div>

      </div>
    </div>
  );
}

export default Products;