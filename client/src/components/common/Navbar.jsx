import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function Navbar() {
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  function handleSearch(event) {
    event.preventDefault();
    const query = searchTerm.trim();
    closeMenu();
    navigate(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
  }

  function handleLogout() {
    logout();
    closeMenu();
    navigate("/", { replace: true });
  }

  return (
    <nav className={`navbar ${menuOpen ? "menu-open" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/Images/Logo_2.0.png" alt="VISIONFORGE" />
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
          <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
          <NavLink to="/products" onClick={closeMenu}>Products</NavLink>
          <NavLink to="/builder" onClick={closeMenu}>PC Builder</NavLink>
          <NavLink to="/compare" onClick={closeMenu}>Compare</NavLink>
          <NavLink to="/ai-assistant" onClick={closeMenu}>AI Assistant</NavLink>
        </div>

        <div className={`navbar-actions ${menuOpen ? "show-mobile-menu" : ""}`}>
          <form className="navbar-search" role="search" onSubmit={handleSearch}>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
            />
            <button type="submit" aria-label="Submit product search">⌕</button>
          </form>

          <Link to="/wishlist" className="navbar-wishlist" onClick={closeMenu} aria-label="Wishlist">
            ♡ <span>Wishlist</span>
          </Link>

          <Link to="/cart" className="navbar-cart" onClick={closeMenu}>
            🛒 Cart ({cartCount})
          </Link>

          {isAuthenticated ? (
            <>
              <span className="navbar-user">
                Hi, {user?.firstName || "User"}
              </span>

              <button
                type="button"
                className="login-btn navbar-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn" onClick={closeMenu}>
                Sign in
              </Link>

              <Link
                to="/register"
                className="login-btn register-nav-btn"
                onClick={closeMenu}
              >
                Register
              </Link>
            </>
          )}

          <Link to="/seller/login" className="seller-btn" onClick={closeMenu}>
            Seller Login
          </Link>

          <Link
            to="/seller/register"
            className="seller-btn"
            onClick={closeMenu}
          >
            Become a Seller
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;