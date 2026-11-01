import { useEffect, useState } from "react";

const INITIAL_LOADING_DURATION = 450;
const MINIMUM_SKELETON_DURATION = 400;

export function waitForInitialLoading() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, INITIAL_LOADING_DURATION);
  });
}

export function waitForMinimumSkeleton(startedAt) {
  const remaining = MINIMUM_SKELETON_DURATION - (Date.now() - startedAt);
  if (remaining <= 0) return Promise.resolve();

  return new Promise((resolve) => {
    window.setTimeout(resolve, remaining);
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
