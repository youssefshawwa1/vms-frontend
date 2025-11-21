import { createContext, useContext, useEffect, useState } from "react";
import { API } from "../Components/Global/Global";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // For initial auth check
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [pendingUserId, setPendingUserId] = useState(null);
  useEffect(() => {
    checkAuthStatus();
  }, []);
  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API}validate-session.php`, {
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();

        if (result.isAuthenticated) {
          setUser(result.user);
          setIsAuthenticated(true);
        }
      } else {
        console.log("Auth check failed with status:", response.status);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };
  const resetVerification = () => {
    setVerificationRequired(false);
    setPendingUserId(null);
  };
  const login = async (userName, password) => {
    setLoading(true);
    const data = { username: userName, password: password };
    const response = await fetch(`${API}login.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      setLoading(false);
      return { message: "Login Failed!" };
    }

    const result = await response.json();

    if (result.requiresVerification) {
      // Show verification code input modal
      setVerificationRequired(true);
      setPendingUserId(result.userId); // Store for verification
      setLoading(false);
      return result;
    }

    if (result.success) {
      setTimeout(() => {
        setUser(result.data.user);
        setIsAuthenticated(true);
      }, 1000);
    }
    setLoading(false);
    return result;
  };
  const verifyTheCode = async (code) => {
    setLoading(true);
    const data = {
      code: code,
      userId: pendingUserId,
    };
    const response = await fetch(`${API}verifyCode.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      setLoading(false);
      return { message: "Verification Failed!" };
    }
    const result = await response.json();

    if (result.success) {
      setUser(result.data.user);
      setIsAuthenticated(true);
      setVerificationRequired(false);
    }
    setLoading(false);
    return result;
  };
  const resendCode = async () => {
    setLoading(true);
    const data = { userId: pendingUserId };
    const response = await fetch(`${API}resendCode.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      setLoading(false);
      return { message: "Faild to resend code!" };
    }
    setLoading(false);
    return await response.json();
  };

  const logout = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}logout.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        // Clear both session and localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");

        setUser(null);
        setIsAuthenticated(false);
      } else {
        console.error("Logout failed with status:", response.status);
        // Still clear frontend state even if backend fails
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Clear frontend state even if network error
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    login,
    logout,
    verificationRequired,
    pendingUserId,
    verifyTheCode,
    resetVerification,
    resendCode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
