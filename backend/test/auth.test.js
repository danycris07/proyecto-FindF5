import assert from "node:assert/strict";
import test from "node:test";
import { hashPassword, verifyPassword } from "../src/auth/password.js";
import {
  clearSessionCookie,
  createSessionToken,
  hashSessionToken,
  readSessionToken,
  setSessionCookie,
} from "../src/auth/session-cookie.js";
import { requireRole } from "../src/middleware/require-auth.js";

test("las contraseñas se guardan con scrypt y se verifican", async () => {
  const hash = await hashPassword("botines-y-cancha-2026");

  assert.match(hash, /^scrypt\$/);
  assert.notEqual(hash, "botines-y-cancha-2026");
  assert.equal(await verifyPassword("botines-y-cancha-2026", hash), true);
  assert.equal(await verifyPassword("otra-clave", hash), false);
  assert.equal(await verifyPassword("cualquiera", "hash-inválido"), false);
});

test("los tokens de sesión son aleatorios y se guardan como hash", () => {
  const firstToken = createSessionToken();
  const secondToken = createSessionToken();

  assert.notEqual(firstToken, secondToken);
  assert.notEqual(hashSessionToken(firstToken), firstToken);
  assert.match(hashSessionToken(firstToken), /^[a-f0-9]{64}$/);
});

test("la cookie de sesión tiene atributos HttpOnly y SameSite", () => {
  const headers = [];
  const response = {
    append(_name, value) {
      headers.push(value);
    },
  };

  setSessionCookie(response, "session-token", false);
  assert.match(headers[0], /HttpOnly/i);
  assert.match(headers[0], /SameSite=Lax/i);
  assert.match(headers[0], /Path=\//i);
  assert.doesNotMatch(headers[0], /Secure/i);

  clearSessionCookie(response, true);
  assert.match(headers[1], /Max-Age=0/i);
  assert.match(headers[1], /Secure/i);
});

test("la cookie de sesión se lee del encabezado HTTP", () => {
  assert.equal(
    readSessionToken({
      headers: { cookie: "theme=dark; findf5_session=session-token" },
    }),
    "session-token",
  );
  assert.equal(readSessionToken({ headers: {} }), null);
});

test("el middleware de roles rechaza usuarios sin permiso", () => {
  const response = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
  let continued = false;
  const next = () => {
    continued = true;
  };

  requireRole("ADMIN")(
    { authUser: { role: "PLAYER" } },
    response,
    next,
  );
  assert.equal(response.statusCode, 403);
  assert.equal(continued, false);

  requireRole("ADMIN")({ authUser: { role: "ADMIN" } }, response, next);
  assert.equal(continued, true);
});
