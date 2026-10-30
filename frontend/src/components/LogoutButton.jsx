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
      className="inline-flex min-h-10 items-center justify-center rounded-sm border border-danger/60 bg-danger/10 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-danger transition-colors hover:border-danger hover:bg-danger/20 cursor-alias"
    >
      Cerrar sesión
    </button>
  );
}

export default LogoutButton;