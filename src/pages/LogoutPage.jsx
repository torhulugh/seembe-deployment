import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext.jsx";

const LogoutPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      await logout();
      navigate("/login", { replace: true });
    };
    run();
  }, [logout, navigate]);

  return (
    <div className="page-loading" role="status">
      Signing you out...
    </div>
  );
};

export default LogoutPage;
