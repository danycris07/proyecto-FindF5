import { Navigate, useLocation } from "react-router-dom";
import { getMockSession } from "../services/sessionService.js";

function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!getMockSession()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
