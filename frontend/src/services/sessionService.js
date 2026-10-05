import { mockUsers } from "../mocks/MockData.js";

const SESSION_USER_KEY = "findf5-session-user";

export function setMockSession(user) {
  if (!user?.id) {
    throw new Error("No se puede iniciar una sesión mock sin un usuario válido.");
  }

  localStorage.setItem(SESSION_USER_KEY, String(user.id));
}

export function getMockSession() {
  const userId = localStorage.getItem(SESSION_USER_KEY);

  if (!userId) {
    return null;
  }

  return mockUsers.find((user) => String(user.id) === userId) ?? null;
}
