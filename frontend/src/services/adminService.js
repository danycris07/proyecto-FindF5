import { apiRequest } from "./apiClient.js";

export function getAdminUsers() {
  return apiRequest("/admin/users");
}

export function createAdminUser(values) {
  return apiRequest("/admin/users", { method: "POST", body: values });
}

export function updateAdminUser(userId, values) {
  return apiRequest(`/admin/users/${encodeURIComponent(userId)}`, {
    method: "PUT",
    body: values,
  });
}

export function deleteAdminUser(userId) {
  return apiRequest(`/admin/users/${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
}

export function getAdminFields() {
  return apiRequest("/admin/fields");
}

export function createAdminField(values) {
  return apiRequest("/admin/fields", { method: "POST", body: values });
}

export function updateAdminField(fieldId, values) {
  return apiRequest(`/admin/fields/${encodeURIComponent(fieldId)}`, {
    method: "PUT",
    body: values,
  });
}

export function deleteAdminField(fieldId) {
  return apiRequest(`/admin/fields/${encodeURIComponent(fieldId)}`, {
    method: "DELETE",
  });
}

export function getAdminMatches() {
  return apiRequest("/admin/matches");
}

export function createAdminMatch(values) {
  return apiRequest("/admin/matches", { method: "POST", body: values });
}

export function updateAdminMatch(matchId, values) {
  return apiRequest(`/admin/matches/${encodeURIComponent(matchId)}`, {
    method: "PUT",
    body: values,
  });
}

export function deleteAdminMatch(matchId) {
  return apiRequest(`/admin/matches/${encodeURIComponent(matchId)}`, {
    method: "DELETE",
  });
}
