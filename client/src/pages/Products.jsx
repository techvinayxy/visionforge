import { useMemo, useState } from "react";

const products = [
  {
  id: 1,
  name: "VISIONFORGE Titan Gaming PC",
  category: "Gaming PCs",
  price: 89999,
  image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1790958993/Titan_Gaming_PC.png",
},
  {
    id: 2,
    name: "VISIONFORGE Phantom Gaming PC",
    category: "Gaming PCs",
    price: 74999,
    image: "/products/gaming-pc-2.jpg",
  },
  {
    id: 3,
    name: "VISIONFORGE Pro Gaming PC",
    category: "Gaming PCs",
    price: 109999,
    image: "/products/gaming-pc-3.jpg",
  },
  {
    id: 4,
    name: "VISIONFORGE Entry Gaming PC",
    category: "Gaming PCs",
    price: 54999,
    image: "/products/gaming-pc-4.jpg",
  },
  {
    id: 5,
    name: "RTX Gaming Graphics Card",
    category: "Graphics Cards",
    price: 54999,
    image: "/products/gpu-1.jpg",
  },
  {
    id: 6,
    name: "RTX Performance Graphics Card",
    category: "Graphics Cards",
    price: 69999,
    image: "/products/gpu-2.jpg",
  },
  {
    id: 7,
    name: "RTX High Performance GPU",
    category: "Graphics Cards",
    price: 84999,
    image: "/products/gpu-3.jpg",
  },
  {
    id: 8,
    name: "Gaming Graphics Card 8GB",
    category: "Graphics Cards",
    price: 32999,
    image: "/products/gpu-4.jpg",
  },
  {
    id: 9,
    name: "Performance Gaming Processor",
    category: "Processors",
    price: 32999,
    image: "/products/cpu-1.jpg",
  },
  {
    id: 10,
    name: "VISIONFORGE Power Processor",
    category: "Processors",
    price: 42999,
    image: "/products/cpu-2.jpg",
  },
  {
    id: 11,
    name: "High Performance CPU",
    category: "Processors",
    price: 51999,
    image: "/products/cpu-3.jpg",
  },
  {
    id: 12,
    name: "Gaming Performance Motherboard",
    category: "Motherboards",
    price: 18999,
    image: "/products/motherboard-1.jpg",
  },
  {
    id: 13,
    name: "VISIONFORGE Pro Motherboard",
    category: "Motherboards",
    price: 24999,
    image: "/products/motherboard-2.jpg",
  },
  {
    id: 14,
    name: "16GB DDR5 Gaming RAM",
    category: "RAM",
    price: 5999,
    image: "/products/ram-1.jpg",
  },
  {
    id: 15,
    name: "32GB DDR5 Performance RAM",
    category: "RAM",
    price: 10999,
    image: "/products/ram-2.jpg",
  },
  {
    id: 16,
    name: "1TB NVMe SSD",
    category: "Storage",
    price: 7999,
    image: "/products/ssd-1.jpg",
  },
  {
    id: 17,
    name: "2TB NVMe Performance SSD",
    category: "Storage",
    price: 13999,
    image: "/products/ssd-2.jpg",
  },
  {
    id: 18,
    name: "VISIONFORGE Gaming Laptop",
    category: "Laptops",
    price: 74999,
    image: "/products/laptop-1.jpg",
  },
  {
    id: 19,
    name: "VISIONFORGE Pro Gaming Laptop",
    category: "Laptops",
    price: 99999,
    image: "/products/laptop-2.jpg",
  },
  {
    id: 20,
    name: "VISIONFORGE Performance Smartphone",
    category: "Mobiles",
    price: 39999,
    image: "/products/mobile-1.jpg",
  },
];

const categories = [
  "All",
  "Gaming PCs",
  "Graphics Cards",
  "Processors",
  "Motherboards",
  "RAM",
  "Storage",
  "Laptops",
  "Mobiles",
];

function Products() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sortBy === "low") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [search, selectedCategory, sortBy]);

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
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="products-categories">
          {categories.map((category) => (
            <button
              key={category}
              className={
                selectedCategory === category ? "active" : ""
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="products-content">

          {/* Sidebar */}
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
                      setSelectedCategory(
                        selectedCategory === category
                          ? "All"
                          : category
                      )
                    }
                  />
                  {category}
                </label>
              ))}
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
              <span>
                {filteredProducts.length} Products
              </span>

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

                  <div className="product-image">
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  </div>

                  <div className="product-info">
                    <span className="product-category">
                      {product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <p className="product-price">
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>

                    <button className="add-cart-btn">
                      Add to Cart
                    </button>
                  </div>

                </div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="no-products">
                  <h3>No products found</h3>
                  <p>
                    Try another search or category.
                  </p>
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