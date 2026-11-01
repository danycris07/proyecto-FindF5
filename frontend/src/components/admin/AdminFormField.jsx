export const adminInputClass =
  "mt-2 min-h-11 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-status focus:ring-2 focus:ring-status/20";

function AdminFormField({
  id,
  label,
  registration,
  type = "text",
  children,
  ...inputProps
}) {
  return (
    <label htmlFor={id} className="block text-xs font-semibold text-text-secondary">
      {label}
      {children ?? (
        <input
          id={id}
          type={type}
          className={adminInputClass}
          {...inputProps}
          {...registration}
        />
      )}
    </label>
  );
}

export default AdminFormField;
