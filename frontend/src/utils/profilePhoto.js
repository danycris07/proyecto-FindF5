const API_BASE_URL = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "");

export function resolveProfilePhotoUrl(photoUrl) {
  if (!photoUrl || !photoUrl.startsWith("/")) return photoUrl ?? "";

  try {
    const apiOrigin = new URL(API_BASE_URL || "/api", window.location.origin).origin;
    return new URL(photoUrl, apiOrigin).href;
  } catch {
    return photoUrl;
  }
}
