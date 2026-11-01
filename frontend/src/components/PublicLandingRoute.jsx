import { Navigate } from "react-router-dom";
import { useSession } from "../context/useSession.js";

function PublicLandingRoute({ children }) {
  const { user, loading } = useSession();

  if (loading) {
    return (
      <p role="status" className="p-8 text-center text-text-secondary">
        Validando tu sesión...
      </p>
    );
  }

  if (user) {
    return <Navigate to="/partidos" replace />;
  }

  return children;
}

export default PublicLandingRoute;
