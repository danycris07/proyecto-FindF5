export function Grupo({ titulo, children }) {
  return (
    <fieldset className="min-w-0 space-y-2">
      <legend className="mb-2 text-sm font-semibold text-white">
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
      <span className="inline-flex min-h-11 items-center rounded-md border border-white/10 bg-[#090d16] px-3 text-sm font-semibold text-slate-300 transition-colors hover:border-[#00e5ff]/40 peer-checked:border-[#00e5ff]/50 peer-checked:bg-[#00e5ff]/10 peer-checked:text-[#7beeff] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#00e5ff]">
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
