import { useEffect, useRef } from "react";
import DeleteMatchDialog from "./DeleteMatchDialog.jsx";

function MatchModal({
  open,
  onClose,
  children,
  size = "max-w-3xl",
  dismissible = true,
  labelledBy,
}) {
  const dialogRef = useRef(null);
  const animationDuration = 300; // Duración de la animación en milisegundos

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onCancel={(event) => {
        if (!dismissible) event.preventDefault();
      }}
      onClick={(event) => {
        if (dismissible && event.target === dialogRef.current) onClose();
      }}
      className={
        animationDuration
          ? `fixed inset-0 m-auto w-full ${size} bg-transparent p-4 ...resto igual... ${open ? "opacity-100" : "opacity-0"}`
          : "...igual..."
      }
      style={{
        animationDuration: `${animationDuration}ms`,
      }}
    >
      {open && children}
    </dialog>
  );
}

export default MatchModal;
