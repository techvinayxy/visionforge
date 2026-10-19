
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

function Register() {
  const {
    register,
    verifyRegistrationOTP,
    resendRegistrationOTP,
  } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    surname: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return undefined;

    const timer = setTimeout(() => {
      setCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleRegister(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const email = form.email.trim().toLowerCase();

    if (!form.firstName.trim() || !form.surname.trim()) {
      setError("Please enter your first name and last name.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        ...form,
        firstName: form.firstName.trim(),
        surname: form.surname.trim(),
        email,
      });

      setForm((previous) => ({
        ...previous,
        email,
      }));

      setOtp("");
      setOtpStep(true);
      setCooldown(result.resendAfterSeconds ?? 60);
      setNotice(
        result.message ||
          `We've sent a 6-digit verification code to ${email}.`
      );
 
    } catch (err) {
      // A pending registration already exists: show the OTP screen.
      if (err.status === 429) {
        setOtpStep(true);
        setOtp("");
        setCooldown(
          Number.isFinite(err.retryAfterSeconds)
            ? Math.max(0, err.retryAfterSeconds)
            : 0
        );
        setNotice(
          err.message ||
            "A verification code was already sent. Enter it below or resend when available."
        );
        setError("");
      } else {
        setError(err.message || "Unable to start registration.");
      }
    } finally {
      setLoading(false);
    }

  }

  async function handleVerify(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      await verifyRegistrationOTP(
        form.email.trim().toLowerCase(),
        otp
      );

      navigate("/", {
        replace: true,
        state: {
          welcome: true,
          userName: form.firstName.trim(),
        },
      });
    } catch (err) {
      setError(err.message || "Unable to verify your email.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setNotice("");
    setResending(true);

    try {
      const result = await resendRegistrationOTP(
        form.email.trim().toLowerCase()
      );

      setOtp("");
      setCooldown(result.resendAfterSeconds ?? 60);
      setNotice(
        result.message || "A new verification code has been sent."
      );
    } catch (err) {
      setError(err.message || "Unable to resend the code.");

      if (Number.isFinite(err.retryAfterSeconds)) {
        setCooldown(Math.max(0, err.retryAfterSeconds));
      }
    } finally {
      setResending(false);
    }
  }

  function handleEditDetails() {
    setOtpStep(false);
    setOtp("");
    setError("");
    setNotice("");
  }

  return (
    <main className="auth-page">
      <section className="auth-shell auth-shell--register">
        <aside className="auth-visual-panel">
          <div className="auth-visual-content">
            <div className="auth-brand auth-brand--visual">
              VISION<span>FORGE</span>
            </div>

            <p className="auth-eyebrow">JOIN THE COMMUNITY</p>

            <h2>
              Imagine it.
              <br />
              Build it.
              <br />
              Own it.
            </h2>

            <p className="auth-visual-copy">
              Create your account and start building a setup
              that matches your ambition.
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

            <p className="auth-eyebrow">
              {otpStep
                ? "EMAIL VERIFICATION"
                : "YOUR JOURNEY STARTS HERE"}
            </p>

            <h1>
              {otpStep ? "Verify your email" : "Create your account"}
            </h1>

            <p className="auth-subtitle">
              {otpStep
                ? `We've sent a 6-digit verification code to ${form.email}.`
                : "Build your setup. Discover your next upgrade."}
            </p>

            {!otpStep ? (
              <form className="auth-form" onSubmit={handleRegister}>
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
                  <span className="auth-password-wrap">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      minLength={8}
                      maxLength={128}
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

                {notice && (
                  <p className="auth-success" role="status">
                    {notice}
                  </p>
                )}

                <button
                  className="auth-submit"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Sending verification code..." : "Register"}
                </button>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleVerify}>
                <label className="auth-field">
                  6-digit verification code
                  <input
                    type="text"
                    inputMode="numeric"
                    name="otp"
                    value={otp}
                    onChange={(event) =>
                      setOtp(
                        event.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    placeholder="Enter 6-digit code"
                    autoComplete="one-time-code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    autoFocus
                    required
                  />
                </label>

                {error && (
                  <p className="auth-error" role="alert">
                    {error}
                  </p>
                )}

                {notice && (
                  <p className="auth-success" role="status">
                    {notice}
                  </p>
                )}

                <button
                  className="auth-submit"
                  type="submit"
                  disabled={loading || otp.length !== 6}
                >
                  {loading
                    ? "Verifying email..."
                    : "Verify email & create account"}
                </button>

                <button
                  className="auth-submit auth-resend"
                  type="button"
                  onClick={handleResend}
                  disabled={resending || cooldown > 0 || loading}
                >
                  {resending
                    ? "Sending new code..."
                    : cooldown > 0
                      ? `Resend code in ${cooldown}s`
                      : "Resend verification code"}
                </button>

                <button
                  className="auth-back"
                  type="button"
                  onClick={handleEditDetails}
                  disabled={loading || resending}
                >
                  Change registration details
                </button>
              </form>
            )}

            <p className="auth-switch">
              Already have an account? <Link to="/login">Log in</Link>
            </p>

            <p className="auth-terms">
              By creating an account, you agree to use VISIONFORGE responsibly.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;
