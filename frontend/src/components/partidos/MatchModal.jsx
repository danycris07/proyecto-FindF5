import { useEffect, useRef } from "react";

function MatchModal({
  open,
  onClose,
  children,
  size = "max-w-3xl",
  dismissible = true,
  labelledBy,
}) {
  const dialogRef = useRef(null);

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
      className={`fixed inset-0 m-auto max-h-dvh w-full ${size} overflow-y-auto bg-transparent p-4 text-text-primary opacity-100 transition-opacity duration-300 backdrop:bg-black/60 backdrop:backdrop-blur-sm starting:open:opacity-0 motion-reduce:transition-none`}
    >
      {open && children}
    </dialog>
  );
}

export default MatchModal;
