import { useNavigate } from "react-router-dom";
import { clearMockSession } from "../services/sessionService.js";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearMockSession();
    navigate("/", { replace: true });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex min-h-10 items-center justify-center rounded-sm border border-red-400/60 bg-red-500/10 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-red-300 transition-colors hover:border-red-300 hover:bg-red-500/20 cursor-alias"
    >
      Cerrar sesión
    </button>
  );
}

export default LogoutButton;
