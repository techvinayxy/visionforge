import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-label">NEXT-GEN TECHNOLOGY MARKETPLACE</p>

        <h1>
          Build.
          <span> Power.</span>
          <br />
          Create.
        </h1>

        <p className="hero-description">
          Discover gaming PCs, powerful components, laptops, mobiles,
          and accessories built for your technology needs.
        </p>

        <div className="hero-buttons">
          <Link to="/products" className="hero-primary-btn">
            Explore Products
          </Link>

          <Link to="/builder" className="hero-secondary-btn">
            Build Your PC
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;