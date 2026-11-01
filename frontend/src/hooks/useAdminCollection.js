import { useCallback, useEffect, useState } from "react";

export function useAdminCollection(loadItems, resourceName) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await loadItems());
    } catch (loadError) {
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
    loadItems()
      .then((loadedItems) => {
        if (active) setItems(loadedItems);
      })
      .catch((loadError) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? `No se pudieron cargar ${resourceName}: ${loadError.message}`
              : `No se pudieron cargar ${resourceName}.`,
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

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
