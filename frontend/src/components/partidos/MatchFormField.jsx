export const inputClassName =
  "mt-2 min-h-12 w-full rounded-sm border border-border bg-background px-4 py-3 text-text-primary outline-none transition placeholder:text-text-secondary focus:border-status focus:ring-2 focus:ring-status/20";

function MatchFormField({ id, label, error, children }) {
  return (
    <div className="rounded-sm border border-border bg-background p-4">
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wider text-text-secondary"
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export default MatchFormField;
