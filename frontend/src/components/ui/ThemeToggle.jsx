import { useState } from "react";

function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme === "light" ? "light" : "dark",
  );

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    try {
      window.localStorage.setItem("findf5-theme", nextTheme);
    } catch {
      document.documentElement.dataset.theme = "dark";
      setTheme("dark");
      return;
    }

    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      aria-label={`Cambiar a tema ${theme === "dark" ? "claro" : "oscuro"}`}
      aria-pressed={theme === "light"}
      onClick={toggleTheme}
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-text-primary shadow-lg shadow-[var(--shadow-color)] backdrop-blur transition-colors duration-200 hover:border-status motion-reduce:transition-none"
    >
      {theme === "dark" ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.5 8.5 0 1 0 20.2 15.2Z" />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;
