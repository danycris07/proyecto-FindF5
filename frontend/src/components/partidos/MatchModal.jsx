import { useEffect, useRef } from "react";

function MatchModal({ open, onClose, children }) {
  const dialogRef = useRef(null);
  const animationDuration = 300; // Duración de la animación en milisegundos

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  // m-auto w-full max-w-3xl bg-transparent p-4 backdrop:bg-black/70 backdrop:backdrop-blur-sm backdrop:transition-opacity backdrop:duration-300 backdrop:backdrop-opacity-0 backdrop:backdrop:opacity-100
  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className={
        animationDuration
          ? `fixed inset-0 m-auto w-full max-w-3xl bg-transparent p-4 backdrop:bg-black/70 backdrop:backdrop-blur-sm backdrop z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-${animationDuration} ${
              open ? "opacity-100" : "opacity-0"
            }`
          : "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
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
