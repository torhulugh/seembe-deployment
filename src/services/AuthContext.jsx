import { createContext, useContext, useEffect, useState } from "react";
import api from "./api";

const STORAGE_KEY = "se-embe:user";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Could not read saved user", error);
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  const saveUser = (userData) => {
    if (userData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setUser(userData || null);
  };

  const loadProfile = async () => {
    try {
      const response = await api.get("/auth/profile");
      saveUser(response.data);
      setAuthError("");
    } catch (error) {
      saveUser(null);
      const message = error.response?.data?.message || "Session expired";
      setAuthError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    saveUser(response.data);
    setAuthError("");
    return response.data;
  };

  const register = async (payload) => {
    const response = await api.post("/auth/register", payload);
    saveUser(response.data);
    setAuthError("");
    return response.data;
  };

  const logout = async () => {
    try {
      await api.get("/auth/logout");
    } catch (error) {
      console.error("Failed to log out", error);
    } finally {
      saveUser(null);
    }
  };

  if (loading) {
    return <div className="app-loading">Loading Seembe...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        authError,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        refreshUser: loadProfile,
        setAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
