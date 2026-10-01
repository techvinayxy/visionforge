import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            VISIONFORGE
          </Link>

          <p>
            Build. Power. Create.
          </p>

          <span>
            Your technology marketplace for powerful
            devices, components, and accessories.
          </span>
        </div>

        <div className="footer-column">
          <h3>Shop</h3>

          <Link to="/products">All Products</Link>
          <Link to="/category/gaming-pcs">Gaming PCs</Link>
          <Link to="/category/components">PC Components</Link>
          <Link to="/category/laptops">Laptops</Link>
          <Link to="/category/mobiles">Mobiles</Link>
        </div>

        <div className="footer-column">
          <h3>Tools</h3>

          <Link to="/builder">PC Builder</Link>
          <Link to="/compare">Compare Products</Link>
          <Link to="/ai-assistant">AI Tech Assistant</Link>
        </div>

        <div className="footer-column">
          <h3>Sell With Us</h3>

          <Link to="/seller/register">Become a Seller</Link>
          <Link to="/seller/login">Seller Login</Link>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 VISIONFORGE. All rights reserved.
        </p>

        <p>
          Build. Power. Create.
        </p>
      </div>
    </footer>
  );
}

export default Footer;