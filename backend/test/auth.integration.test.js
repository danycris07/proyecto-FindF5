import "dotenv/config";
import assert from "node:assert/strict";
import { once } from "node:events";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { createApp } from "../src/app.js";
import { SESSION_COOKIE_NAME } from "../src/auth/session-cookie.js";
import { createAuthRouter } from "../src/routes/auth.routes.js";

const enabled = process.env.RUN_DB_INTEGRATION_TESTS === "1";

test(
  "registro, login, sesión y logout funcionan con MySQL",
  { skip: !enabled },
  async () => {
    const { sequelize, models } = await import("../src/database/index.js");
    const email = `auth-test-${randomUUID()}@example.com`;
    const password = `Cancha-${randomUUID()}-2026`;
    let server;
    let userId;

    try {
      await sequelize.authenticate();
      await sequelize.sync({ alter: false, force: false });

      const app = createApp({
        authRouter: createAuthRouter({ models, sequelize }),
      });
      server = app.listen(0);
      await once(server, "listening");
      const address = server.address();
      assert.ok(address && typeof address === "object");
      const baseUrl = `http://127.0.0.1:${address.port}/api/auth`;

      const preflightResponse = await fetch(`${baseUrl}/register`, {
        method: "OPTIONS",
        headers: {
          Origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": "content-type",
        },
      });
      assert.equal(preflightResponse.status, 204);
      assert.equal(
        preflightResponse.headers.get("access-control-allow-credentials"),
        "true",
      );

      const adminRegistrationResponse = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Admin no autorizado",
          email: `admin-test-${randomUUID()}@example.com`,
          password,
          role: "ADMIN",
        }),
      });
      assert.equal(adminRegistrationResponse.status, 400);

      const fieldOwnerPositionResponse = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Dueño inválido",
          email: `owner-test-${randomUUID()}@example.com`,
          password,
          role: "FIELD_OWNER",
          position: "GOALKEEPER",
        }),
      });
      assert.equal(fieldOwnerPositionResponse.status, 400);

      const invalidPhoneResponse = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Teléfono inválido",
          email: `phone-test-${randomUUID()}@example.com`,
          password,
          phone: "123",
        }),
      });
      assert.equal(invalidPhoneResponse.status, 400);

      const registrationResponse = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Jugador de prueba",
          email,
          password,
          role: "PLAYER",
        }),
      });
      assert.equal(registrationResponse.status, 201);

      const registrationBody = await registrationResponse.json();
      userId = registrationBody.user.id;
      assert.equal(registrationBody.user.position, null);
      assert.equal("passwordHash" in registrationBody.user, false);

      const registrationCookie = registrationResponse.headers
        .get("set-cookie")
        ?.split(";")[0];
      assert.ok(registrationCookie?.startsWith(`${SESSION_COOKIE_NAME}=`));

      const duplicateResponse = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Jugador duplicado",
          email,
          password,
          role: "PLAYER",
        }),
      });
      assert.equal(duplicateResponse.status, 409);

      const invalidLoginResponse = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "clave-incorrecta" }),
      });
      assert.equal(invalidLoginResponse.status, 401);
      assert.deepEqual(await invalidLoginResponse.json(), {
        message: "Credenciales inválidas.",
      });

      const loginResponse = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      assert.equal(loginResponse.status, 200);
      const loginCookie = loginResponse.headers.get("set-cookie")?.split(";")[0];
      assert.ok(loginCookie?.startsWith(`${SESSION_COOKIE_NAME}=`));

      const sessionResponse = await fetch(`${baseUrl}/me`, {
        headers: { Cookie: loginCookie },
      });
      assert.equal(sessionResponse.status, 200);
      assert.equal((await sessionResponse.json()).user.email, email);

      const logoutResponse = await fetch(`${baseUrl}/logout`, {
        method: "POST",
        headers: { Cookie: loginCookie },
      });
      assert.equal(logoutResponse.status, 204);
      assert.match(logoutResponse.headers.get("set-cookie") ?? "", /Max-Age=0/i);

      const expiredSessionResponse = await fetch(`${baseUrl}/me`, {
        headers: { Cookie: loginCookie },
      });
      assert.equal(expiredSessionResponse.status, 401);
    } finally {
      if (userId) {
        await models.Session.destroy({ where: { userId } });
        await models.User.destroy({ where: { id: userId }, force: true });
      }

      if (server) {
        server.close();
        await once(server, "close");
      }
      await sequelize.close();
    }
  },
);
