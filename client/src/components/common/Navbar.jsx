
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";

function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/Logo.png" alt="VISIONFORGE" />
        </Link>

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/builder">PC Builder</Link>
          <Link to="/compare">Compare</Link>
          <Link to="/ai-assistant">AI Assistant</Link>
        </div>

        {/* Navbar Actions */}
        <div className="navbar-actions">
          <Link to="/cart" className="navbar-cart">
            🛒 Cart ({cartCount})
          </Link>

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