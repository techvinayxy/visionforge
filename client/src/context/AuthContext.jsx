
import {
  createContext,
  useContext,
  useState,
} from "react";

// Use Render API in production if VITE_API_URL is missing.
// Locally, continue using Vite's /api proxy.
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

  async function authenticate(endpoint, formData) {
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
      throw new Error(
        data.message || "Authentication failed. Please try again."
      );
    }

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

  function register(formData) {
    return authenticate("register", formData);
  }

  function login(formData) {
    return authenticate("login", formData);
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
