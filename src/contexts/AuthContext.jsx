import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext();
import { API } from "../Components/Global/Global";
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // For initial auth check
  useEffect(() => {
    checkAuthStatus();
  }, []);
  const checkAuthStatus = async () => {
    try {
      console.log("Checking auth status...");
      const response = await fetch(
        `http://localhost/vms/backend/api/validate-session.php`,
        {
          credentials: "include",
        }
      );

      console.log("Auth check response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("Auth check result:", result);
        if (result.isAuthenticated) {
          setUser(result.user);
          setIsAuthenticated(true);
        }
      } else {
        console.log("Auth check failed with status:", response.status);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      console.error("Error details:", error.message);
    } finally {
      setLoading(false);
    }
  };
  const login = async (userName, password) => {
    const data = {
      username: userName,
      password: password,
    };
    const response = await fetch(`http://localhost/vms/backend/api/login.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      return { message: "Login Failed!" };
    }
    const result = await response.json();
    if (result.success) {
      setTimeout(() => {
        setUser(result.data.user);
        setIsAuthenticated(true);
      }, 1000);
    }
    return result;
  };

  const logout = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost/vms/backend/api/logout.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
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
