export function Grupo({ titulo, children }) {
  return (
    <fieldset className="min-w-0 space-y-2">
      <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
        {titulo}
      </legend>
      {children}
    </fieldset>
  );
}

export function Chip({ tipo, name, checked, onChange, children }) {
  return (
    <label className="cursor-pointer">
      <input
        type={tipo}
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className="inline-flex min-h-11 items-center rounded-sm border border-border bg-background px-3 text-sm font-semibold text-text-primary transition-colors hover:border-primary peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary-text peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-status">
        {children}
      </span>
    </label>
  );
}

export function Opciones({ name, opciones, valor, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map(([id, etiqueta]) => (
        <Chip
          key={id}
          tipo="radio"
          name={name}
          checked={valor === id}
          onChange={() => onChange(id)}
        >
          {etiqueta}
        </Chip>
      ))}
    </div>
  );
}
