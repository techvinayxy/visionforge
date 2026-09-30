import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="navbar-logo">
          VISIONFORGE
        </Link>

        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/builder">PC Builder</Link>
          <Link to="/compare">Compare</Link>
          <Link to="/ai-assistant">AI Assistant</Link>
        </div>

        <div className="navbar-actions">
          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/seller/register" className="seller-btn">
            Become a Seller
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;