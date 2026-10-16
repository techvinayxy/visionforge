import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    surname: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">VISION<span>FORGE</span></div>
        <p className="auth-eyebrow">JOIN THE COMMUNITY</p>
        <h1>Create your account</h1>
        <p className="auth-subtitle">
          Build your setup. Discover your next upgrade.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field-row">
            <label className="auth-field">
              First name
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First name"
                autoComplete="given-name"
                maxLength={50}
                required
              />
            </label>

            <label className="auth-field">
              Last name
              <input
                type="text"
                name="surname"
                value={form.surname}
                onChange={handleChange}
                placeholder="Last name"
                autoComplete="family-name"
                maxLength={50}
                required
              />
            </label>
          </div>

          <label className="auth-field">
            Email address
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              maxLength={254}
              required
            />
          </label>

          <label className="auth-field">
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
            />
          </label>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>

        <p className="auth-terms">
          By creating an account, you agree to use VISIONFORGE responsibly.
        </p>
      </section>
    </main>
  );
}

export default Register;
