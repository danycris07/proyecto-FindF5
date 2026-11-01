import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";
import AdminFieldsPanel from "../components/admin/AdminFieldsPanel.jsx";
import AdminMatchesPanel from "../components/admin/AdminMatchesPanel.jsx";
import AdminUsersPanel from "../components/admin/AdminUsersPanel.jsx";

const TABS = [
  { id: "users", label: "Usuarios" },
  { id: "fields", label: "Canchas" },
  { id: "matches", label: "Partidos" },
];

function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <main className="relative isolate min-h-screen bg-background font-sans text-text-primary">
      <div
        aria-hidden="true"
        className="landing-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-152"
      />
      <ThemeToggle />
      <header className="border-b border-border bg-surface/70">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-end justify-between gap-4 px-5 py-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-status">
              FindF5 · Administración
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-wider sm:text-4xl">
              Panel administrador
            </h1>
          </div>
          <Link
            to="/partidos"
            className="font-semibold text-text-primary underline underline-offset-4"
          >
            Volver a convocatorias
          </Link>
        </div>
      </header>
      <div className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8">
        <nav
          aria-label="Administrar recursos"
          className="mb-6 flex flex-wrap gap-2"
        >
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`min-h-11 rounded-sm border px-4 py-2 text-sm font-bold uppercase tracking-wider ${
                activeTab === id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface text-text-primary hover:border-status"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        {activeTab === "users" && <AdminUsersPanel />}
        {activeTab === "fields" && <AdminFieldsPanel />}
        {activeTab === "matches" && <AdminMatchesPanel />}
      </div>
    </main>
  );
}

export default AdminPage;
