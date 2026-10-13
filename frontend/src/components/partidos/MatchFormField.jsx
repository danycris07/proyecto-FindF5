export const inputClassName =
  "mt-2 min-h-12 w-full rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20";

function MatchFormField({ id, label, error, children }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

export default MatchFormField;
