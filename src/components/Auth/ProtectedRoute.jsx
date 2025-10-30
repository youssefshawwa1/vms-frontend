// Components/Auth/ProtectedRoute.jsx
import { useAuth } from "../../Contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  //   if (loading) {
  //     return <div>Loading...</div>; // Or your loading component
  //   }
  console.log(isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
