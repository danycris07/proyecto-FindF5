import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import { Route, Routes } from "react-router-dom";
import { Registro } from "./pages/Registro";
import { Login } from "./pages/Login";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/registro" element={<Registro />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </>
  );
}

export default App;
