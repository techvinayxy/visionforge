import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";

function Navbar() {
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar ${menuOpen ? "menu-open" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/Logo.png" alt="VISIONFORGE" />
        </Link>

        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="navbar-navigation"
        >
          {menuOpen ? "×" : "☰"}
        </button>

        <div
          id="navbar-navigation"
          className={`navbar-links ${menuOpen ? "show-mobile-menu" : ""}`}
        >
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/products" onClick={closeMenu}>Products</Link>
          <Link to="/builder" onClick={closeMenu}>PC Builder</Link>
          <Link to="/compare" onClick={closeMenu}>Compare</Link>
          <Link to="/ai-assistant" onClick={closeMenu}>AI Assistant</Link>
        </div>

        <div className={`navbar-actions ${menuOpen ? "show-mobile-menu" : ""}`}>
          <Link to="/cart" className="navbar-cart" onClick={closeMenu}>
            🛒 Cart ({cartCount})
          </Link>
          <Link to="/login" className="login-btn" onClick={closeMenu}>
            Login
          </Link>
          <Link to="/seller/register" className="seller-btn" onClick={closeMenu}>
            Become a Seller
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
