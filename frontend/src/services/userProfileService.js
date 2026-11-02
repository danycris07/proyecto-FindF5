import { apiClient, apiRequest } from "./apiClient.js";
import { getSessionUser, setSessionUser } from "./sessionService.js";

export async function getUserProfile(userId) {
  if (!Number.isInteger(Number(userId)) || Number(userId) < 1) {
    throw new Error("El identificador del jugador no es válido.");
  }
  return apiRequest(`/users/${encodeURIComponent(userId)}/profile`);
}

export async function uploadProfilePhoto(file) {
  const response = await apiClient.post("/users/me/profile-photo", file, {
    transformRequest: [(data) => data],
    headers: { "Content-Type": file.type },
  });
  const user = { ...getSessionUser(), ...response.data.user };
  setSessionUser(user);
  return user;
}
