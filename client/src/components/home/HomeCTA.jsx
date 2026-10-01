import { Link } from "react-router-dom";

function HomeCTA() {
  return (
    <section className="home-cta">
      <div className="cta-container">
        <p className="cta-label">READY TO BUILD?</p>

        <h2>
          Your Next Setup
          <span> Starts Here.</span>
        </h2>

        <p className="cta-description">
          Explore powerful technology, build your dream PC,
          and find the right products for your needs.
        </p>

        <div className="cta-buttons">
          <Link to="/products" className="cta-primary-btn">
            Explore Products
          </Link>

          <Link to="/builder" className="cta-secondary-btn">
            Start PC Builder
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HomeCTA;