import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "../context/useSession.js";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { user, loading } = useSession();

  if (loading) {
    return (
      <p role="status" className="p-8 text-center text-text-secondary">
        Validando tu sesión...
      </p>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
