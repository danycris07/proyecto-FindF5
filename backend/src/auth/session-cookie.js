import { createHash, randomBytes } from "node:crypto";
import { parseCookie, stringifySetCookie } from "cookie";

export const SESSION_COOKIE_NAME = "findf5_session";
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export function createSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export function readSessionToken(request) {
  const cookies = parseCookie(request.headers.cookie ?? "");
  return cookies[SESSION_COOKIE_NAME] ?? null;
}

export function setSessionCookie(response, token, isProduction) {
  response.append(
    "Set-Cookie",
    stringifySetCookie({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_MS / 1000,
    }),
  );
}

export function clearSessionCookie(response, isProduction) {
  response.append(
    "Set-Cookie",
    stringifySetCookie({
      name: SESSION_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    }),
  );
}
