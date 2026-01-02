import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [pendingUserId, setPendingUserId] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Validates existing token on refresh
  const checkAuthStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // This hits the endpoint we just created in the backend
      const response = await api.get("/validate-token");
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      logout(); // Clear local storage and state if token is bad
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post("/login", { email, password });

      if (response.data.mfaRequired) {
        setPendingUserId(response.data.userId);
        setExpiresAt(response.data.expiresAt); // For the frontend timer
        setVerificationRequired(true);
        setLoading(false);
        return { success: true, mfaRequired: true };
      }

      // If MFA is not required (standard login)
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
      }

      return response.data;
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || "Login Failed",
      };
    }
  };

  const resendCode = async () => {
    try {
      // Hits the new /resend-otp endpoint
      const response = await api.post("/resend-otp", { userId: pendingUserId });

      if (response.data.success) {
        // IMPORTANT: Update the expiration time to restart the timer
        setExpiresAt(response.data.expiresAt);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to resend code",
      };
    }
  };

  const verifyTheCode = async (code) => {
    setLoading(true);
    try {
      const response = await api.post("/verify-otp", {
        userId: pendingUserId,
        code: code,
      });

      if (response.data.success) {
        const { token, user: userData } = response.data;

        localStorage.setItem("token", token);
        setUser(userData);
        setIsAuthenticated(true);
        setVerificationRequired(false);
        setPendingUserId(null);
        setExpiresAt(null); // Stop the timer
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid Code",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    setVerificationRequired(false);
    setPendingUserId(null);
    setExpiresAt(null);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    verificationRequired,
    verifyTheCode,
    resendCode,
    expiresAt,
    resetVerification: () => {
      setVerificationRequired(false);
      setExpiresAt(null);
      setPendingUserId(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
