
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({
        ...form,
        email: form.email.trim().toLowerCase(),
      });

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-shell auth-shell--login">
        <aside className="auth-visual-panel">
          <div className="auth-visual-content">
            <div className="auth-brand auth-brand--visual">
              VISION<span>FORGE</span>
            </div>

            <p className="auth-eyebrow">BUILT FOR WHAT'S NEXT</p>

            <h2>
              Your next
              <br />
              level starts here.
            </h2>

            <p className="auth-visual-copy">
              Discover powerful hardware, create your dream setup,
              and bring your vision to life.
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

        <div className="auth-form-panel">
          <div className="auth-form-inner">
            <div className="auth-brand auth-brand--mobile">
              VISION<span>FORGE</span>
            </div>

            <p className="auth-eyebrow">WELCOME BACK</p>
            <h1>Log in to your account</h1>

            <p className="auth-subtitle">
              Sign in to continue your VISIONFORGE experience.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
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

                <span className="auth-password-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    className="auth-password-toggle"
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </span>
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
                {loading ? "Signing in..." : "Log in"}
              </button>
            </form>

            <p className="auth-switch">
              Don&apos;t have an account?{" "}
              <Link to="/register">Create one</Link>
            </p>

            <p className="auth-terms">
              Keep your account credentials private.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
