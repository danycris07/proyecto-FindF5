import { useContext } from "react";
import { AuthContext } from "./authContextValue.js";

export function useSession() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSession debe usarse dentro de AuthProvider.");
  }
  return context;
}
