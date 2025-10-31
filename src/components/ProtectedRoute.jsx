import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../services/AuthContext.jsx";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
