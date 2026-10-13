import { Navigate } from "react-router-dom";
import { getMockSession } from "../services/sessionService.js";

function PublicLandingRoute({ children }) {
  if (getMockSession()) {
    return <Navigate to="/partidos" replace />;
  }

  return children;
}

export default PublicLandingRoute;
