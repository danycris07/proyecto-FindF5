import { useCallback, useEffect, useState } from "react";
import { getAvailableFields } from "../services/fieldService.js";
import { waitForMinimumSkeleton } from "./useInitialLoading.js";

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
    const startedAt = Date.now();
    setState((current) => ({ ...current, loading: true, error: "" }));
    const result = await requestFields();
    await waitForMinimumSkeleton(startedAt);
    setState({ ...result, loading: false });
  }, []);

  useEffect(() => {
    let active = true;
    const cargarCanchas = async () => {
      const startedAt = Date.now();
      const result = await requestFields();
      await waitForMinimumSkeleton(startedAt);
      if (active) {
        setState({ ...result, loading: false });
      }
    };
    void cargarCanchas();

    return () => {
      active = false;
    };
  }, []);

  return { ...state, retry };
}
