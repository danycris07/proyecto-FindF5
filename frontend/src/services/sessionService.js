import { apiRequest } from "./apiClient.js";

const SESSION_USER_KEY = "findf5-auth-user";
const SESSION_CHANGE_EVENT = "findf5:session-change";

export function getSessionUser() {
  const storedUser = localStorage.getItem(SESSION_USER_KEY);
  if (!storedUser) return null;

  const user = JSON.parse(storedUser);
  if (!user || typeof user !== "object" || !user.id) {
    throw new Error("No se pudo leer el usuario de la sesión.");
  }
  return user;
}

function publishSessionChange(user) {
  window.dispatchEvent(
    new CustomEvent(SESSION_CHANGE_EVENT, { detail: user }),
  );
}

export function setSessionUser(user) {
  if (!user?.id) {
    throw new Error("No se puede iniciar una sesión sin un usuario válido.");
  }

  localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  publishSessionChange(user);
}

export function clearSessionUser() {
  localStorage.removeItem(SESSION_USER_KEY);
  publishSessionChange(null);
}

export function subscribeToSessionChanges(listener) {
  const handleChange = (event) => listener(event.detail);
  window.addEventListener(SESSION_CHANGE_EVENT, handleChange);
  return () => window.removeEventListener(SESSION_CHANGE_EVENT, handleChange);
}

export async function registerUser(values) {
  const result = await apiRequest("/auth/register", {
    method: "POST",
    body: values,
  });
  setSessionUser(result.user);
  return result.user;
}

export async function loginUser(values) {
  const result = await apiRequest("/auth/login", {
    method: "POST",
    body: values,
  });
  setSessionUser(result.user);
  return result.user;
}

export async function getCurrentSession() {
  try {
    const result = await apiRequest("/auth/me");
    setSessionUser(result.user);
    return result.user;
  } catch (error) {
    if (error?.status === 401) {
      clearSessionUser();
      return null;
    }
    throw error;
  }
}

export async function updateCurrentUser(values) {
  const result = await apiRequest("/auth/me", {
    method: "PATCH",
    body: values,
  });
  setSessionUser(result.user);
  return result.user;
}

export async function logoutUser() {
  await apiRequest("/auth/logout", { method: "POST" });
  clearSessionUser();
}
