import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const API_BASE_URL = (
  (import.meta.env.VITE_API_URL || "").trim() ||
  (import.meta.env.PROD ? "https://visionforge-api-wu2u.onrender.com" : "")
).replace(/\/+$/, "");

function SellerDashboard() {
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [message, setMessage] = useState("Verifying your seller session...");

  useEffect(() => {
    let active = true;
    async function verifySession() {
      const token = localStorage.getItem("vf-seller-token");
      if (!token) {
        navigate("/seller/login", { replace: true });
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/sellers/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Your seller session is no longer valid.");
        if (active) {
          setSeller(data.seller);
          setMessage("");
          localStorage.setItem("vf-seller", JSON.stringify(data.seller));
        }
      } catch (error) {
        localStorage.removeItem("vf-seller-token");
        localStorage.removeItem("vf-seller");
        if (active) {
          setMessage(error.message || "Please sign in again.");
          navigate("/seller/login", { replace: true });
        }
      }
    }
    verifySession();
    return () => { active = false; };
  }, [navigate]);

  function logout() {
    localStorage.removeItem("vf-seller-token");
    localStorage.removeItem("vf-seller");
    navigate("/seller/login", { replace: true });
  }

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-form-panel">
          <div className="auth-form-inner">
            <p className="auth-eyebrow">VISIONFORGE SELLER PORTAL</p>
            <h1>Seller dashboard</h1>
            {message && <p role="status">{message}</p>}
            {seller && <>
              <p className="auth-subtitle">Welcome, {seller.ownerName}.</p>
              <div className="auth-field"><strong>Store</strong><p>{seller.businessName}</p></div>
              <div className="auth-field"><strong>Business email</strong><p>{seller.email}</p></div>
              <div className="auth-field"><strong>Application status</strong><p>{seller.status}</p></div>
              <p className="auth-subtitle">Your seller session is verified. Product listing management is not available yet.</p>
              <button className="auth-submit" type="button" onClick={logout}>Log out</button>
            </>}
            <p className="auth-switch"><Link to="/products">Explore marketplace</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
}
export default SellerDashboard;
