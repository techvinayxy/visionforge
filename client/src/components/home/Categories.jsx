
import { Link } from "react-router-dom";

function Categories() {
  const categories = [
    {
      title: "Gaming PCs",
      description: "Powerful systems built for gaming.",
    },
    {
      title: "PC Components",
      description: "Build and upgrade your perfect PC.",
    },
    {
      title: "Laptops",
      description: "Performance for work and play.",
    },
    {
      title: "Mobiles",
      description: "Latest smartphones and devices.",
    },
    {
      title: "Accessories",
      description: "Complete your technology setup.",
    },
  ];

  return (
    <section className="categories-section">
      <div className="section-container">
        <div className="section-heading">
          <p>EXPLORE VISIONFORGE</p>
          <h2>Shop by Category</h2>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              to={`/products?category=${encodeURIComponent(category.title)}`}
              className="category-card"
              key={category.title}
            >
              <div className="category-icon">⚡</div>

              <h3>{category.title}</h3>

              <p>{category.description}</p>

              <span>Explore →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;