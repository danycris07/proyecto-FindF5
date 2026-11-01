const DEFAULT_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";
const MINIMUM_REQUEST_INTERVAL_MS = 1000;
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;
const MAX_CACHE_ENTRIES = 500;
const REQUEST_TIMEOUT_MS = 8000;

export class ReverseGeocodeError extends Error {
  constructor(message, status = 502, options) {
    super(message, options);
    this.name = "ReverseGeocodeError";
    this.status = status;
  }
}

export function createReverseGeocoder({
  endpoint = DEFAULT_REVERSE_URL,
  fetchImpl = fetch,
  now = Date.now,
  wait = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds)),
  minimumIntervalMs = MINIMUM_REQUEST_INTERVAL_MS,
  cacheDurationMs = CACHE_DURATION_MS,
  maxCacheEntries = MAX_CACHE_ENTRIES,
} = {}) {
  const reverseUrl = new URL(endpoint);
  if (reverseUrl.protocol !== "https:") {
    throw new Error("La URL de geocodificación debe usar HTTPS.");
  }

  const cache = new Map();
  let lastRequestAt = null;
  let requestQueue = Promise.resolve();

  async function fetchAddress(latitude, longitude) {
    const url = new URL(reverseUrl);
    url.searchParams.set("lat", String(latitude));
    url.searchParams.set("lon", String(longitude));
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("zoom", "18");
    url.searchParams.set("addressdetails", "1");

    let response;
    try {
      response = await fetchImpl(url, {
        headers: {
          Accept: "application/json",
          "Accept-Language": "es",
          "User-Agent":
            "FindF5/1.0 (+https://github.com/danycris07/proyecto-FindF5)",
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      throw new ReverseGeocodeError(
        "No se pudo consultar la dirección de esta ubicación.",
        502,
        { cause: error },
      );
    }

    if (response.status === 404) return null;
    if (response.status === 429) {
      throw new ReverseGeocodeError(
        "El servicio de mapas limitó temporalmente las consultas. Volvé a intentar en un momento.",
        503,
      );
    }
    if (!response.ok) {
      throw new ReverseGeocodeError(
        "El servicio de mapas no pudo obtener la dirección.",
        502,
      );
    }

    let result;
    try {
      result = await response.json();
    } catch (error) {
      throw new ReverseGeocodeError(
        "El servicio de mapas devolvió una respuesta inválida.",
        502,
        { cause: error },
      );
    }

    return typeof result?.display_name === "string"
      ? result.display_name
      : null;
  }

  function getCached(key) {
    const entry = cache.get(key);
    if (!entry || entry.expiresAt <= now()) {
      cache.delete(key);
      return { found: false, address: null };
    }
    cache.delete(key);
    cache.set(key, entry);
    return { found: true, address: entry.address };
  }

  async function reverse(latitudeValue, longitudeValue) {
    const latitude = Number(latitudeValue);
    const longitude = Number(longitudeValue);
    if (
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90 ||
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw new ReverseGeocodeError("Las coordenadas no son válidas.", 400);
    }

    const normalizedLatitude = Number(latitude.toFixed(6));
    const normalizedLongitude = Number(longitude.toFixed(6));
    const cacheKey = `${normalizedLatitude},${normalizedLongitude}`;
    const cached = getCached(cacheKey);
    if (cached.found) return cached.address;

    const result = requestQueue.then(async () => {
      const queuedCache = getCached(cacheKey);
      if (queuedCache.found) return queuedCache.address;

      if (lastRequestAt !== null) {
        const delay = Math.max(
          0,
          lastRequestAt + minimumIntervalMs - now(),
        );
        if (delay > 0) await wait(delay);
      }

      lastRequestAt = now();
      const address = await fetchAddress(
        normalizedLatitude,
        normalizedLongitude,
      );
      cache.set(cacheKey, {
        address,
        expiresAt: now() + cacheDurationMs,
      });
      while (cache.size > maxCacheEntries) {
        cache.delete(cache.keys().next().value);
      }
      return address;
    });

    requestQueue = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }

  return reverse;
}
