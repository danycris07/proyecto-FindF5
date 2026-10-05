import { useCallback, useEffect, useState } from "react";
import { getAvailableFields } from "../services/fieldService.js";

async function requestFields() {
  try {
    return { fields: await getAvailableFields(), error: "" };
  } catch (error) {
    return {
      fields: [],
      error:
        error instanceof Error
          ? `No se pudieron cargar las canchas: ${error.message}`
          : "No se pudieron cargar las canchas.",
    };
  }
}

export function useAvailableFields() {
  const [state, setState] = useState({
    fields: [],
    loading: true,
    error: "",
  });

  const retry = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: "" }));
    const result = await requestFields();
    setState({ ...result, loading: false });
  }, []);

  useEffect(() => {
    let active = true;

    requestFields().then((result) => {
      if (active) {
        setState({ ...result, loading: false });
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return { ...state, retry };
}
