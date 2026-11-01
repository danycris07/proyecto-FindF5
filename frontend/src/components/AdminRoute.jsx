import { Navigate } from "react-router-dom";
import { useSession } from "../context/useSession.js";

function AdminRoute({ children }) {
  const { user } = useSession();
  if (user?.role !== "ADMIN") {
    return <Navigate to="/partidos" replace />;
  }
  return children;
}

export default AdminRoute;
