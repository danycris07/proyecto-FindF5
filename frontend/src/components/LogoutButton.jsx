import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logoutUser } from "../services/sessionService.js";

function LogoutButton() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    setPending(true);
    setError("");
    try {
      await logoutUser();
      navigate("/", { replace: true });
    } catch (logoutError) {
      setError(
        logoutError instanceof Error
          ? logoutError.message
          : "No se pudo cerrar sesión.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div>
      {error && <p role="alert" className="mb-2 text-sm text-danger">{error}</p>}
      <button
        type="button"
        onClick={handleLogout}
        disabled={pending}
        className="inline-flex min-h-10 items-center justify-center rounded-sm border border-danger/60 bg-danger/10 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-danger transition-colors hover:border-danger hover:bg-danger/20 disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Cerrando sesión..." : "Cerrar sesión"}
      </button>
    </div>
  );
}

export default LogoutButton;