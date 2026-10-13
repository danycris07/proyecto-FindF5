// src/App.jsx
import LandingPage from "./pages/LandingPage";
import { Route, Routes } from "react-router-dom";
import { Registro } from "./pages/Registro";
import { Login } from "./pages/Login";
import PartidosPage from "./pages/PartidosPage";
import PartidoPublicado from "./pages/PartidoPublicado";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLandingRoute from "./components/PublicLandingRoute";
import ArmarPartido from "./pages/ArmarPartido";
import UserMenu from "./components/UserMenu.jsx";

function AuthenticatedLayout({ children }) {
  return (
    <ProtectedRoute>
      <>
        <UserMenu />
        {children}
      </>
    </ProtectedRoute>
  );
}

function App() {
  return (
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
            <ArmarPartido />
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
            <ArmarPartido />
          </AuthenticatedLayout>
        }
      />
    </Routes>
  );
}

export default App;
