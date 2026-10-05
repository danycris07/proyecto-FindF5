import LandingPage from "./pages/LandingPage";
import { Route, Routes } from "react-router-dom";
import { Registro } from "./pages/Registro";
import { Login } from "./pages/Login";
import PartidosPage from "./pages/PartidosPage";
import PartidoPublicado from "./pages/PartidoPublicado";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLandingRoute from "./components/PublicLandingRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PublicLandingRoute><LandingPage /></PublicLandingRoute>} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/partidos"
          element={
            <ProtectedRoute>
              <PartidosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/partidos/:partidoId"
          element={
            <ProtectedRoute>
              <PartidoPublicado />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
