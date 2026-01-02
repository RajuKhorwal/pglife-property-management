// frontend/src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";

// Create the context
export const AuthContext = createContext();

// Safe JSON parser
function safeJSONParse(item) {
  try {
    return JSON.parse(item);
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? safeJSONParse(localStorage.getItem("user"))
      : null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Keep user logged in if token exists
  useEffect(() => {
    if (token && !user) {
      const storedUser = localStorage.getItem("user")
        ? safeJSONParse(localStorage.getItem("user"))
        : null;

      if (storedUser) {
        // Ensure avatar_url has full URL
        if (storedUser.avatar_url && !storedUser.avatar_url.startsWith("http")) {
          storedUser.avatar_url = `${process.env.REACT_APP_BACKEND_URL}${storedUser.avatar_url}`;
        }
        setUser(storedUser);
      }
    }
  }, [token]);

  // Login function
  const login = (userData, jwtToken = null) => {
    // Ensure avatar_url has full URL
    if (userData.avatar_url && !userData.avatar_url.startsWith("http")) {
      userData.avatar_url = `${process.env.REACT_APP_BACKEND_URL}${userData.avatar_url}`;
    }

    setUser(userData);

    if (jwtToken) {
      setToken(jwtToken);
      localStorage.setItem("token", jwtToken);
    }

    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Handle expired/invalid token
  const logoutOnExpire = () => {
    alert("Session expired. Please log in again.");
    logout();
  };

  // Prepare axios/fetch header
  const tokenHeader = token ? { Authorization: `Bearer ${token}` } : {};

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        isAuthenticated: !!token,
        isAdmin: user?.isAdmin || false,
        login,
        logout,
        logoutOnExpire,
        tokenHeader,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
