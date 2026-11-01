import { useEffect, useState } from "react";
import { AuthContext } from "./authContextValue.js";
import {
  getCurrentSession,
  getSessionUser,
  subscribeToSessionChanges,
} from "../services/sessionService.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSessionUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => subscribeToSessionChanges(setUser), []);

  useEffect(() => {
    let active = true;
    getCurrentSession()
      .then((currentUser) => {
        if (active) {
          setUser(currentUser);
          setError("");
        }
      })
      .catch((sessionError) => {
        if (active) {
          setError(
            sessionError instanceof Error
              ? sessionError.message
              : "No se pudo validar la sesión.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}
