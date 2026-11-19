
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import products from "../data/products";

const categories = [
  "All",
  "Gaming PCs",
  "PC Components",
  "Graphics Cards",
  "Processors",
  "Motherboards",
  "RAM",
  "Storage",
  "Laptops",
  "Mobiles",
  "Accessories",
];

const componentCategories = [
  "Graphics Cards",
  "Processors",
  "Motherboards",
  "RAM",
  "Storage",
];

function Products() {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(() => searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    () => searchParams.get("category") || "All"
  );
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    setSearch(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") || "All";

    setSelectedCategory(
      categories.includes(categoryFromUrl) ? categoryFromUrl : "All"
    );
  }, [searchParams]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);

      if (category === "All") {
        nextParams.delete("category");
      } else {
        nextParams.set("category", category);
      }

      return nextParams;
    });
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (selectedCategory === "PC Components" &&
          componentCategories.includes(product.category)) ||
        product.category === selectedCategory;

      const normalizedSearch = search.trim().toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch);

      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "under25" && product.price < 25000) ||
        (priceRange === "25to50" &&
          product.price >= 25000 &&
          product.price <= 50000) ||
        (priceRange === "50to100" &&
          product.price > 50000 &&
          product.price <= 100000) ||
        (priceRange === "above100" && product.price > 100000);

      return matchesCategory && matchesSearch && matchesPrice;
    });

    if (sortBy === "low") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    // Product records currently have no createdAt field. Use descending catalogue
    // IDs as the available fallback until real product creation dates are stored.
    if (sortBy === "newest") {
      result = [...result].sort((a, b) => b.id - a.id);
    }

    return result;
  }, [search, selectedCategory, priceRange, sortBy]);

  return (
    <div className="products-page">
      <div className="products-container">
        <div className="products-header">
          <div>
            <h1>Products</h1>
            <p>Explore technology products.</p>
          </div>

          <div className="products-search">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="products-categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={selectedCategory === category ? "active" : ""}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="products-content">
          <aside className="products-sidebar">
            <h3>Filters</h3>

            <div className="filter-section">
              <h4>Category</h4>

              {categories.slice(1).map((category) => (
                <label key={category}>
                  <input
                    type="checkbox"
                    checked={selectedCategory === category}
                    onChange={() =>
                      handleCategoryChange(
                        selectedCategory === category ? "All" : category
                      )
                    }
                  />
                  {category}
                </label>
              ))}
            </div>

            <div className="filter-section">
              <h4>Price Range</h4>

              {[
                { label: "Under ₹25,000", value: "under25" },
                { label: "₹25,000 - ₹50,000", value: "25to50" },
                { label: "₹50,000 - ₹1,00,000", value: "50to100" },
                { label: "Above ₹1,00,000", value: "above100" },
              ].map((range) => (
                <label key={range.value}>
                  <input
                    type="checkbox"
                    checked={priceRange === range.value}
                    onChange={() =>
                      setPriceRange(
                        priceRange === range.value ? "all" : range.value
                      )
                    }
                  />
                  {range.label}
                </label>
              ))}
            </div>
          </aside>

          <main className="products-main">
            <div className="products-toolbar">
              <span>{filteredProducts.length} Products</span>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="popular">Sort: Popular</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <div className="product-card" key={product.id}>
                  <button
                    type="button"
                    className={`product-wishlist-btn ${isWishlisted(product.id) ? "is-wishlisted" : ""}`}
                    onClick={() => toggleWishlist(product)}
                    aria-label={isWishlisted(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                    aria-pressed={isWishlisted(product.id)}
                  >
                    {isWishlisted(product.id) ? "♥" : "♡"}
                  </button>
                  <Link
                    to={`/products/${product.id}`}
                    className="product-card-link"
                  >
                    <div className="product-image">
                      <img src={product.images?.[0] || product.image || ""} alt={product.name} />
                    </div>

                    <div className="product-info">
                      <span className="product-category">
                        {product.category}
                      </span>

                      <h3>{product.name}</h3>

                      <p className="product-price">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    className="add-cart-btn"
                    onClick={() =>
                      addToCart(product, 1)
                    }
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="no-products">
                  <h3>No products found</h3>
                  <p>Try another search or category.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Products;