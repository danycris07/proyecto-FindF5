// src/App.jsx
import { lazy, Suspense } from "react";
import { LazyMotion } from "framer-motion";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLandingRoute from "./components/PublicLandingRoute";
import AppNavigation from "./components/ui/AppNavigation.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import PlayerRoute from "./components/PlayerRoute.jsx";

const LandingPage = lazy(() => import("./pages/LandingPage.jsx"));
const Registro = lazy(() =>
  import("./pages/Registro.jsx").then((module) => ({
    default: module.Registro,
  })),
);
const Login = lazy(() =>
  import("./pages/Login.jsx").then((module) => ({ default: module.Login })),
);
const PartidosPage = lazy(() => import("./pages/PartidosPage.jsx"));
const PartidoPublicado = lazy(() => import("./pages/PartidoPublicado.jsx"));
const ArmarPartido = lazy(() => import("./pages/ArmarPartido.jsx"));
const MisPartidos = lazy(() => import("./pages/MisPartidos.jsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.jsx"));

const loadMotionFeatures = () =>
  import("framer-motion").then((module) => module.domAnimation);

function PageLoadingFallback() {
  return (
    <main
      role="status"
      aria-label="Cargando página"
      className="min-h-screen bg-background px-5 py-10"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-10 w-64 animate-pulse rounded-sm bg-border/70 motion-reduce:animate-none" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="h-52 animate-pulse rounded-sm border border-border bg-surface motion-reduce:animate-none"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function AuthenticatedLayout({ children }) {
  return (
    <ProtectedRoute>
      <>
        <AppNavigation />
        {children}
      </>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <LazyMotion features={loadMotionFeatures}>
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
        <Route
          path="/"
          element={
            <PublicLandingRoute>
              <LandingPage />
            </PublicLandingRoute>
          }
        />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/partidos"
          element={
            <AuthenticatedLayout>
              <PartidosPage />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/partidos/nuevo"
          element={
            <AuthenticatedLayout>
              <PlayerRoute>
                <ArmarPartido />
              </PlayerRoute>
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/mis-partidos"
          element={
            <AuthenticatedLayout>
              <MisPartidos />
            </AuthenticatedLayout>
          }
        />
        {/* Ruta para ver el detalle del partido */}
        <Route
          path="/partidos/:partidoId"
          element={
            <AuthenticatedLayout>
              <PartidoPublicado />
            </AuthenticatedLayout>
          }
        />
        {/* Nueva ruta para editar un partido existente */}
        <Route
          path="/partidos/:partidoId/editar"
          element={
            <AuthenticatedLayout>
              <PlayerRoute>
                <ArmarPartido />
              </PlayerRoute>
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <AuthenticatedLayout>
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            </AuthenticatedLayout>
          }
        />
        </Routes>
      </Suspense>
    </LazyMotion>
  );
}

export default App;