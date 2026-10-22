import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Auth.css";

const API_BASE_URL = (
  (import.meta.env.VITE_API_URL || "").trim() ||
  (import.meta.env.PROD ? "https://visionforge-api-wu2u.onrender.com" : "")
).replace(/\/+$/, "");

const initialForm = {
  ownerName: "",
  businessName: "",
  email: "",
  phone: "",
  businessType: "Retailer",
  address: "",
  website: "",
  description: "",
};

function SellerRegister() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/sellers/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ownerName: form.ownerName.trim(),
          businessName: form.businessName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          website: form.website.trim(),
          description: form.description.trim(),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to submit your seller application.");
      setNotice(data.message || "Application submitted. Our team will review it.");
      setForm(initialForm);
    } catch (err) {
      setError(err.message || "Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page seller-application-page">
      <section className="auth-shell auth-shell--register seller-application-shell">
        <aside className="auth-visual-panel">
          <div className="auth-visual-content">
            <div className="auth-brand auth-brand--visual">VISION<span>FORGE</span></div>
            <p className="auth-eyebrow">SELL WITH VISIONFORGE</p>
            <h2>Bring your store to the next level.</h2>
            <p className="auth-visual-copy">
              Apply to join our technology marketplace and reach customers looking for their next upgrade.
            </p>
            <div className="auth-orbit" aria-hidden="true">
              <div className="auth-orbit-ring auth-orbit-ring--outer" />
              <div className="auth-orbit-ring auth-orbit-ring--inner" />
              <div className="auth-orbit-core">VF</div>
              <span className="auth-orbit-dot auth-orbit-dot--one" />
              <span className="auth-orbit-dot auth-orbit-dot--two" />
            </div>
            <p className="auth-tagline">BUILD. POWER. CREATE.</p>
          </div>
        </aside>

        <div className="auth-form-panel seller-application-form-panel">
          <div className="auth-form-inner seller-application-form-inner">
            <div className="auth-brand auth-brand--mobile">VISION<span>FORGE</span></div>
            <p className="auth-eyebrow">SELLER ONBOARDING</p>
            <h1>Apply to become a seller</h1>
            <p className="auth-subtitle">Share your business details. Seller access is enabled only after approval.</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field-row">
                <label className="auth-field">Owner / contact name
                  <input name="ownerName" value={form.ownerName} onChange={handleChange} autoComplete="name" maxLength={100} required placeholder="Your full name" />
                </label>
                <label className="auth-field">Business / store name
                  <input name="businessName" value={form.businessName} onChange={handleChange} maxLength={120} required placeholder="Your store name" />
                </label>
              </div>
              <div className="auth-field-row">
                <label className="auth-field">Business email
                  <input type="email" name="email" value={form.email} onChange={handleChange} autoComplete="email" maxLength={254} required placeholder="business@example.com" />
                </label>
                <label className="auth-field">Mobile number
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} autoComplete="tel" maxLength={20} minLength={7} required placeholder="+91 ..." />
                </label>
              </div>
              <label className="auth-field">Business type
                <select name="businessType" value={form.businessType} onChange={handleChange} required>
                  <option>Retailer</option>
                  <option>Manufacturer / Brand</option>
                  <option>Distributor / Wholesaler</option>
                  <option>Individual seller</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="auth-field">Business address
                <textarea name="address" value={form.address} onChange={handleChange} rows={3} maxLength={500} required placeholder="Shop / office address, city, state, PIN code" />
              </label>
              <label className="auth-field">Website (optional)
                <input type="url" name="website" value={form.website} onChange={handleChange} maxLength={300} placeholder="https://yourstore.com" />
              </label>
              <label className="auth-field">What products do you plan to sell? (optional)
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} maxLength={1000} placeholder="Gaming PCs, components, laptops, mobiles..." />
              </label>

              {error && <p className="auth-error" role="alert">{error}</p>}
              {notice && <p className="auth-success" role="status">{notice}</p>}

              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? "Submitting application..." : "Submit seller application"}
              </button>
            </form>

            <p className="auth-switch">Already have a customer account? <Link to="/login">Log in</Link></p>
            <p className="auth-terms">Submitting an application does not grant seller access. Our team must approve it first.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SellerRegister;
