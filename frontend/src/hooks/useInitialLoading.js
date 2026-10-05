import { useEffect, useState } from "react";

const INITIAL_LOADING_DURATION = 600;

export function waitForInitialLoading() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, INITIAL_LOADING_DURATION);
  });
}

export function useInitialLoading() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setIsLoading(false),
      INITIAL_LOADING_DURATION,
    );

    return () => window.clearTimeout(timeoutId);
  }, []);

  return isLoading;
}
