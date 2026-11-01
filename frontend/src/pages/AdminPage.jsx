import { useState } from "react";
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
    <main className="relative isolate min-h-screen bg-background pt-20 pb-24 font-sans text-text-primary md:pt-24 md:pb-12">
      <div
        aria-hidden="true"
        className="landing-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-152"
      />
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
