import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const API_BASE_URL = (
  (import.meta.env.VITE_API_URL || "").trim() ||
  (import.meta.env.PROD ? "https://visionforge-api-wu2u.onrender.com" : "")
).replace(/\/+$/, "");

function SellerLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/sellers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim().toLowerCase(), password: form.password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to sign in.");
      localStorage.setItem("vf-seller-token", data.token);
      localStorage.setItem("vf-seller", JSON.stringify(data.seller));
      navigate("/seller/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-shell auth-shell--login">
        <aside className="auth-visual-panel">
          <div className="auth-visual-content">
            <div className="auth-brand auth-brand--visual">VISION<span>FORGE</span></div>
            <p className="auth-eyebrow">SELLER PORTAL</p>
            <h2>Power your business forward.</h2>
            <p className="auth-visual-copy">Sign in to manage your VISIONFORGE seller account and product listings.</p>
            <div className="auth-orbit" aria-hidden="true"><div className="auth-orbit-ring auth-orbit-ring--outer" /><div className="auth-orbit-ring auth-orbit-ring--inner" /><div className="auth-orbit-core">VF</div><span className="auth-orbit-dot auth-orbit-dot--one" /><span className="auth-orbit-dot auth-orbit-dot--two" /></div>
            <p className="auth-tagline">BUILD. POWER. CREATE.</p>
          </div>
        </aside>
        <div className="auth-form-panel">
          <div className="auth-form-inner">
            <div className="auth-brand auth-brand--mobile">VISION<span>FORGE</span></div>
            <p className="auth-eyebrow">WELCOME BACK, SELLER</p>
            <h1>Seller login</h1>
            <p className="auth-subtitle">Use the business email and password from your seller application.</p>
            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="auth-field">Business email
                <input type="email" name="email" value={form.email} onChange={handleChange} autoComplete="username" maxLength={254} required placeholder="business@example.com" />
              </label>
              <label className="auth-field">Password
                <span className="auth-password-wrap">
                  <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} autoComplete="current-password" required placeholder="Enter your password" />
                  <button className="auth-password-toggle" type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? "Hide" : "Show"}</button>
                </span>
              </label>
              {error && <p className="auth-error" role="alert">{error}</p>}
              <button className="auth-submit" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in as seller"}</button>
            </form>
            <p className="auth-switch">Not a seller yet? <Link to="/seller/register">Apply to become a seller</Link></p>
            <p className="auth-switch">Customer? <Link to="/login">Customer login</Link></p>
            <p className="auth-terms">Seller access is available only after your application is approved.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
export default SellerLogin;
