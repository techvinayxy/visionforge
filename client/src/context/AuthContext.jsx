
import {
  createContext,
  useContext,
  useState,
} from "react";

const configuredApiUrl = (import.meta.env.VITE_API_URL || "").trim();

const API_BASE_URL = (
  configuredApiUrl ||
  (import.meta.env.PROD
    ? "https://visionforge-api-wu2u.onrender.com"
    : "")
).replace(/\/+$/, "");

const AuthContext = createContext(null);

function getSavedUser() {
  try {
    const saved = localStorage.getItem("vf-user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);

  const [token, setToken] = useState(
    () => localStorage.getItem("vf-token") || ""
  );

  async function request(endpoint, formData) {
    let response;

    try {
      response = await fetch(
        `${API_BASE_URL}/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
    } catch (error) {
      console.error("Authentication request failed:", error);

      throw new Error(
        "Unable to connect to the server. Please try again."
      );
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(
        data.message || "Request failed. Please try again."
      );

      error.status = response.status;
      error.retryAfterSeconds = data.retryAfterSeconds;
      throw error;
    }

    return data;
  }

  function saveSession(data) {
    if (!data.token || !data.user) {
      throw new Error("The server returned an invalid response.");
    }

    try {
      localStorage.setItem("vf-token", data.token);
      localStorage.setItem("vf-user", JSON.stringify(data.user));
    } catch {
      throw new Error(
        "Unable to save your session in this browser."
      );
    }

    setToken(data.token);
    setUser(data.user);

    return data;
  }

  // Registration now starts email verification.
  function register(formData) {
    return request("register", formData);
  }

  // Create a session only after the server confirms OTP verification.
  async function verifyRegistrationOTP(email, otp) {
    const data = await request("verify-otp", { email, otp });
    return saveSession(data);
  }

  function resendRegistrationOTP(email) {
    return request("resend-otp", { email });
  }

  async function login(formData) {
    const data = await request("login", formData);
    return saveSession(data);
  }

  function logout() {
    localStorage.removeItem("vf-token");
    localStorage.removeItem("vf-user");

    setToken("");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        register,
        verifyRegistrationOTP,
        resendRegistrationOTP,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }


  return context;
}

