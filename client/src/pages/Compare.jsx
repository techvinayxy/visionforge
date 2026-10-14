
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCompare } from "../context/CompareContext.jsx";
import "../styles/Compare.css";

const catalog = [
  { id: 1, name: "VISIONFORGE Titan Gaming PC", category: "Gaming PCs", price: 89999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1790958993/Titan_Gaming_PC.png" },
  { id: 2, name: "VISIONFORGE Phantom Gaming PC", category: "Gaming PCs", price: 74999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791010393/Phantom_Gaming_PC.jpg" },
  { id: 3, name: "VISIONFORGE Pro Gaming PC", category: "Gaming PCs", price: 109999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791010644/Pro_Gaming_PC.jpg" },
  { id: 4, name: "VISIONFORGE Entry Gaming PC", category: "Gaming PCs", price: 54999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791010952/Entry_Gaming_PC.jpg" },
  { id: 5, name: "RTX Gaming Graphics Card", category: "Graphics Cards", price: 54999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791011087/RTX_Gaming_Graphics_Card.jpg" },
  { id: 6, name: "RTX Performance Graphics Card", category: "Graphics Cards", price: 69999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791011211/RTX_Performance_Graphics_Card.jpg" },
  { id: 7, name: "RTX High Performance GPU", category: "Graphics Cards", price: 84999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791011393/RTX_High_Performance_GPU.jpg" },
  { id: 8, name: "Gaming Graphics Card 8GB", category: "Graphics Cards", price: 32999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791011561/Gaming_Graphics_Card_8GB.jpg" },
  { id: 9, name: "Performance Gaming Processor", category: "Processors", price: 32999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791011857/Performance_Gaming_Processor.jpg" },
  { id: 10, name: "VISIONFORGE Power Processor", category: "Processors", price: 42999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791012001/Power_Processor.jpg" },
  { id: 11, name: "High Performance CPU", category: "Processors", price: 51999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791267083/High_Performance_CPU.webp" },
  { id: 12, name: "Gaming Performance Motherboard", category: "Motherboards", price: 18999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791267271/Gaming_Performance_Motherboard.jpg" },
  { id: 13, name: "VISIONFORGE Pro Motherboard", category: "Motherboards", price: 24999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791267441/VISIONFORGE_Pro_Motherboard.webp" },
  { id: 14, name: "16GB DDR5 Gaming RAM", category: "RAM", price: 5999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791267702/16GB_DDR5_Gaming_RAM.webp" },
  { id: 15, name: "32GB DDR5 Performance RAM", category: "RAM", price: 10999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791268097/32GB_DDR5_Performance_RAM.jpg" },
  { id: 16, name: "1TB NVMe SSD", category: "Storage", price: 7999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791268365/1TB_NVMe_SSD.webp" },
  { id: 17, name: "2TB NVMe Performance SSD", category: "Storage", price: 13999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791527396/2TB_NVMe_Performance_SSD.jpg" },
  { id: 18, name: "VISIONFORGE Gaming Laptop", category: "Laptops", price: 74999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791527535/Gaming_Laptop.jpg" },
  { id: 19, name: "VISIONFORGE Pro Gaming Laptop", category: "Laptops", price: 99999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791527640/Pro_Gaming_Laptop.jpg" },
  { id: 20, name: "VISIONFORGE Performance Smartphone", category: "Mobiles", price: 39999, image: "https://res.cloudinary.com/cm0zg2bc/image/upload/v1791528474/Performance_Smartphone.png" },
];

const categories = [...new Set(catalog.map((product) => product.category))];

const specifications = [
  "Brand",
  "Processor",
  "Memory",
  "Storage",
  "Graphics",
  "Warranty",
];

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function getBrand(product) {
  return product.name.startsWith("VISIONFORGE")
    ? "VISIONFORGE"
    : "Not specified";
}

export default function Compare() {
  const {
    compareProducts,
    addCompareProduct,
    removeCompareProduct,
    clearCompare,
  } = useCompare();

  const [category, setCategory] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");

  const categoryProducts = useMemo(
    () => catalog.filter((product) => product.category === category),
    [category]
  );

  const availableProducts = useMemo(
    () =>
      categoryProducts.filter(
        (product) =>
          !compareProducts.some(
            (item) => String(item.id) === String(product.id)
          )
      ),
    [categoryProducts, compareProducts]
  );

  function handleCategoryChange(value) {
    setCategory(value);
    setSelectedId("");
    setMessage("");
  }

  function handleAddProduct() {
    if (!selectedId) {
      setMessage("Please select a product first.");
      return;
    }

    if (compareProducts.length >= 3) {
      setMessage("You can compare a maximum of 3 products.");
      return;
    }

    const product = catalog.find(
      (item) => String(item.id) === String(selectedId)
    );

    if (!product) {
      setMessage("Product not found. Please select another product.");
      return;
    }

    if (
      compareProducts.some(
        (item) => String(item.id) === String(product.id)
      )
    ) {
      setMessage("This product is already selected.");
      return;
    }

    if (
      compareProducts.length > 0 &&
      compareProducts[0].category !== product.category
    ) {
      setMessage("Please select products from the same category.");
      return;
    }

    addCompareProduct(product);
    setCategory(product.category);
    setSelectedId("");
    setMessage("");
  }

  function handleRemove(id) {
    removeCompareProduct(id);

    if (compareProducts.length <= 1) {
      setCategory("");
    }

    setMessage("");
  }

  return (
    <main className="compare-page">
      <section className="compare-hero">
        <span className="compare-eyebrow">VISIONFORGE COMPARISON</span>
        <h1>
          Compare <span>Products</span>
        </h1>
        <p>
          Choose products from the same category and compare them
          side by side.
        </p>
      </section>

      <section className="compare-content">
        <div className="compare-toolbar">
          <div>
            <h2>Select Products</h2>
            <p>
              {compareProducts.length} of 3 products selected
            </p>
          </div>

          {compareProducts.length > 0 && (
            <button
              className="compare-clear"
              type="button"
              onClick={() => {
                clearCompare();
                setCategory("");
                setSelectedId("");
                setMessage("");
              }}
            >
              Clear All
            </button>
          )}
        </div>

        <section className="compare-selector">
          <div className="compare-selector-field">
            <label htmlFor="compare-category">1. Select category</label>
            <select
              id="compare-category"
              value={category}
              onChange={(event) =>
                handleCategoryChange(event.target.value)
              }
            >
              <option value="">Choose a category</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="compare-selector-field">
            <label htmlFor="compare-product">2. Select product</label>
            <select
              id="compare-product"
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              disabled={!category || availableProducts.length === 0}
            >
              <option value="">
                {!category
                  ? "Choose a category first"
                  : availableProducts.length === 0
                    ? "No more products available"
                    : "Choose a product"}
              </option>

              {availableProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} — {formatPrice(product.price)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="compare-add-btn"
            onClick={handleAddProduct}
            disabled={
              !selectedId ||
              compareProducts.length >= 3
            }
          >
            + Add Product
          </button>

          {message && (
            <p className="compare-message" role="status">
              {message}
            </p>
          )}
        </section>

        {compareProducts.length === 0 ? (
          <div className="compare-empty">
            <div className="compare-empty-icon">⇄</div>
            <h2>Ready to compare?</h2>
            <p>
              Select a category, choose a product, and add at least
              two products to start comparing.
            </p>
            <Link to="/products" className="compare-primary-btn">
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            <div
              className="compare-product-grid"
              style={{
                gridTemplateColumns: `repeat(${compareProducts.length}, minmax(0, 1fr))`,
              }}
            >
              {compareProducts.map((product) => (
                <article
                  className="compare-product-card"
                  key={product.id}
                >
                  <button
                    type="button"
                    className="compare-remove"
                    onClick={() => handleRemove(product.id)}
                    aria-label={`Remove ${product.name}`}
                    title="Remove product"
                  >
                    ×
                  </button>

                  <div className="compare-product-image">
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </div>

                  <span className="compare-category">
                    {product.category}
                  </span>
                  <h3>{product.name}</h3>
                  <strong className="compare-price">
                    {formatPrice(product.price)}
                  </strong>

                  <Link
                    to={`/products?category=${encodeURIComponent(product.category)}`}
                    className="compare-view-btn"
                  >
                    Browse Category
                  </Link>
                </article>
              ))}
            </div>

            <section className="compare-specs-section">
              <div className="compare-specs-heading">
                <span>PRODUCT DETAILS</span>
                <h2>Side-by-Side Comparison</h2>
              </div>

              <div className="compare-table-wrapper">
                <table className="compare-table">
                  <thead>
                    <tr>
                      <th>Specification</th>
                      {compareProducts.map((product) => (
                        <th key={product.id}>{product.name}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>Category</td>
                      {compareProducts.map((product) => (
                        <td key={product.id}>{product.category}</td>
                      ))}
                    </tr>

                    <tr>
                      <td>Price</td>
                      {compareProducts.map((product) => (
                        <td
                          className="compare-table-price"
                          key={product.id}
                        >
                          {formatPrice(product.price)}
                        </td>
                      ))}
                    </tr>

                    {specifications.map((spec) => (
                      <tr key={spec}>
                        <td>{spec}</td>
                        {compareProducts.map((product) => (
                          <td key={product.id}>
                            {spec === "Brand"
                              ? getBrand(product)
                              : "Not specified"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}
