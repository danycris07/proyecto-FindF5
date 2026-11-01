const API_BASE_URL = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest(path, { method = "GET", body } = {}) {
  if (!API_BASE_URL) {
    throw new Error("Configurá VITE_API_URL para conectar con el backend.");
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `No se pudo conectar con el servidor: ${error.message}`
        : "No se pudo conectar con el servidor.",
      { cause: error },
    );
  }

  if (response.status === 204) {
    return null;
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    if (response.ok) {
      throw new Error("El servidor devolvió una respuesta inválida.");
    }
  }
  if (!response.ok) {
    throw new ApiError(
      payload?.message ?? `La solicitud falló (${response.status}).`,
      response.status,
    );
  }
  return payload;
}

export function shouldUseMockFallback(error) {
  return !(error instanceof ApiError) || error.status >= 500;
}

export function reportMockFallback(resource, error) {
  console.warn(`Se muestran datos de prueba para ${resource}.`, error);
}
