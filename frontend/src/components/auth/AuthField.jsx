const CONTROL =
  "mt-2 min-h-12 w-full rounded-sm border bg-background px-4 py-3 text-text-primary outline-none transition placeholder:text-text-secondary focus:ring-2";

const SUBMIT =
  "inline-flex min-h-12 w-full items-center justify-center rounded-sm border border-primary-foreground bg-primary px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-primary-foreground shadow-[0_8px_30px_var(--primary-shadow)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_34px_var(--primary-shadow-strong)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 motion-reduce:transition-none";

/**
 * Campo de formulario de las pantallas de acceso: label asociado,
 * estado de error accesible y estilos alineados con el resto de formularios.
 * `registration` es lo que devuelve `register("campo", reglas)` de react-hook-form.
 */
export function AuthField({
  id,
  label,
  error,
  registration,
  as: Control = "input",
  children,
  ...controlProps
}) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wider text-text-secondary"
      >
        {label}
      </label>
      <Control
        id={id}
        {...registration}
        {...controlProps}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        className={`${CONTROL} ${
          error
            ? "border-danger focus:border-danger focus:ring-danger/20"
            : "border-border focus:border-status focus:ring-status/20"
        }`}
      >
        {children}
      </Control>
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function AuthSubmitButton({ children, disabled }) {
  return (
    <button type="submit" disabled={disabled} className={SUBMIT}>
      {children}
    </button>
  );
}
