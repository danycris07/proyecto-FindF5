import { useCallback, useEffect, useState } from "react";
import { waitForMinimumSkeleton } from "./useInitialLoading.js";

export function useAdminCollection(loadItems, resourceName) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    const startedAt = Date.now();
    setLoading(true);
    setError("");
    try {
      const loadedItems = await loadItems();
      await waitForMinimumSkeleton(startedAt);
      setItems(loadedItems);
    } catch (loadError) {
      await waitForMinimumSkeleton(startedAt);
      setError(
        loadError instanceof Error
          ? `No se pudieron cargar ${resourceName}: ${loadError.message}`
          : `No se pudieron cargar ${resourceName}.`,
      );
    } finally {
      setLoading(false);
    }
  }, [loadItems, resourceName]);

  useEffect(() => {
    let active = true;
    const cargarItems = async () => {
      const startedAt = Date.now();
      try {
        const loadedItems = await loadItems();
        await waitForMinimumSkeleton(startedAt);
        if (active) setItems(loadedItems);
      } catch (loadError) {
        await waitForMinimumSkeleton(startedAt);
        if (active) {
          setError(
            loadError instanceof Error
              ? `No se pudieron cargar ${resourceName}: ${loadError.message}`
              : `No se pudieron cargar ${resourceName}.`,
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void cargarItems();

    return () => {
      active = false;
    };
  }, [loadItems, resourceName]);

  const runMutation = async (operation, successCallback) => {
    setError("");
    try {
      await operation();
      await refresh();
      successCallback?.();
      return true;
    } catch (mutationError) {
      setError(
        mutationError instanceof Error
          ? mutationError.message
          : `No se pudo actualizar ${resourceName}.`,
      );
      return false;
    }
  };

  return { items, loading, error, refresh, runMutation };
}
