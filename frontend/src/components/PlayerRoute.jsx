import { Navigate } from "react-router-dom";
import { useSession } from "../context/useSession.js";

function PlayerRoute({ children }) {
  const { user } = useSession();
  if (user?.role !== "PLAYER") {
    return <Navigate to="/partidos" replace />;
  }
  return children;
}

export default PlayerRoute;
