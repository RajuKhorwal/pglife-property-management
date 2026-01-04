// frontend/src/context/AuthContext.js - IMPROVED VERSION

import { createContext, useState, useEffect } from "react";

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
  const [authLoading, setAuthLoading] = useState(true);

  // Keep user logged in if token exists
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      const parsedUser = safeJSONParse(storedUser);
      setToken(storedToken);
      setUser(parsedUser);
    }

    setAuthLoading(false);
  }, []);

  // ✅ IMPROVED: Helper function to ensure avatar URL is properly formatted
  const formatAvatarUrl = (avatarUrl) => {
    if (!avatarUrl) return null;
    
    // If already a full URL (Cloudinary), return as is
    if (avatarUrl.startsWith("http")) {
      return avatarUrl;
    }
    
    // If relative path, prepend backend URL
    if (avatarUrl.startsWith("/")) {
      return `${process.env.REACT_APP_BACKEND_URL}${avatarUrl}`;
    }
    
    return avatarUrl;
  };

  // ✅ IMPROVED: Update user function with proper avatar URL handling
  const updateUser = (userData) => {
    const updatedUser = {
      ...userData,
      avatar_url: formatAvatarUrl(userData.avatar_url)
    };
    
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // Login function
  const login = (userData, jwtToken = null) => {
    // Format avatar URL
    const formattedUser = {
      ...userData,
      avatar_url: formatAvatarUrl(userData.avatar_url)
    };

    setUser(formattedUser);

    if (jwtToken) {
      setToken(jwtToken);
      localStorage.setItem("token", jwtToken);
    }

    localStorage.setItem("user", JSON.stringify(formattedUser));
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
        setUser: updateUser, // ✅ CHANGED: Use updateUser instead of setUser directly
        token,
        authLoading,
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