import "dotenv/config";
import assert from "node:assert/strict";
import { once } from "node:events";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { createApp } from "../src/app.js";
import {
  createSessionToken,
  hashSessionToken,
} from "../src/auth/session-cookie.js";
import { createAuthRouter } from "../src/routes/auth.routes.js";

const enabled = process.env.RUN_DB_INTEGRATION_TESTS === "1";

function assertNoSensitiveProfileFields(value) {
  if (!value || typeof value !== "object") return;
  for (const [key, nestedValue] of Object.entries(value)) {
    assert.notEqual(key.toLowerCase(), "email");
    assert.notEqual(key.toLowerCase(), "password");
    assert.notEqual(key.toLowerCase(), "passwordhash");
    assert.notEqual(key.toLowerCase(), "salt");
    assert.notEqual(key.toLowerCase(), "sessiondata");
    assert.notEqual(key.toLowerCase(), "sessiontoken");
    assert.notEqual(key.toLowerCase(), "token");
    assertNoSensitiveProfileFields(nestedValue);
  }
}

test(
  "perfiles protegen sesión, teléfono y datos sensibles con MySQL",
  { skip: !enabled },
  async () => {
    const { sequelize, models } = await import("../src/database/index.js");
    const { createUsersRouter } = await import("../src/routes/users.routes.js");
    const userIds = [];
    const cookies = new Map();
    let server;

    try {
      await sequelize.authenticate();
      await sequelize.sync({ alter: false, force: false });

      for (const label of ["profile-owner", "profile-viewer"]) {
        const user = await models.User.create({
          name: `Perfil ${label}`,
          email: `profile-${label}-${randomUUID()}@example.com`,
          passwordHash: `integration-hash-${randomUUID()}`,
          role: "PLAYER",
          position: "FIELD_PLAYER",
          dominantFoot: "RIGHT",
          phone: "+5493624123456",
          isPhoneVisible: false,
        });
        userIds.push(user.id);

        const token = createSessionToken();
        await models.Session.create({
          tokenHash: hashSessionToken(token),
          userId: user.id,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        });
        cookies.set(label, `findf5_session=${token}`);
      }

      const app = createApp({
        authRouter: createAuthRouter({ models, sequelize }),
        usersRouter: createUsersRouter({ models }),
      });
      server = app.listen(0);
      await once(server, "listening");
      const address = server.address();
      assert.ok(address && typeof address === "object");
      const baseUrl = `http://127.0.0.1:${address.port}/api`;
      const owner = userIds[0];
      const viewerCookie = cookies.get("profile-viewer");

      const request = async (path, { cookie, method = "GET", body } = {}) => {
        const response = await fetch(`${baseUrl}${path}`, {
          method,
          headers: {
            ...(cookie ? { Cookie: cookie } : {}),
            ...(body ? { "Content-Type": "application/json" } : {}),
          },
          ...(body ? { body: JSON.stringify(body) } : {}),
        });
        return {
          response,
          payload: response.status === 204 ? null : await response.json(),
        };
      };

      const anonymousProfile = await request(`/users/${owner}/profile`);
      assert.equal(anonymousProfile.response.status, 401);

      const anonymousEdit = await request("/auth/me", {
        method: "PATCH",
        body: { isPhoneVisible: true },
      });
      assert.equal(anonymousEdit.response.status, 401);

      const missingProfile = await request("/users/4294967295/profile", {
        cookie: viewerCookie,
      });
      assert.equal(missingProfile.response.status, 404);

      const hiddenProfile = await request(`/users/${owner}/profile`, {
        cookie: viewerCookie,
      });
      assert.equal(hiddenProfile.response.status, 200);
      assert.equal("phone" in hiddenProfile.payload, false);
      assertNoSensitiveProfileFields(hiddenProfile.payload);

      const keepPhoneHidden = await request("/auth/me", {
        cookie: cookies.get("profile-owner"),
        method: "PATCH",
        body: { isPhoneVisible: false },
      });
      assert.equal(keepPhoneHidden.response.status, 200);
      assert.equal(keepPhoneHidden.payload.user.isPhoneVisible, false);

      const ownerCookie = cookies.get("profile-owner");
      const updatedProfile = await request("/auth/me", {
        cookie: ownerCookie,
        method: "PATCH",
        body: {
          position: "GOALKEEPER",
          dominantFoot: "LEFT",
          phone: "+5493624998877",
          isPhoneVisible: true,
        },
      });
      assert.equal(updatedProfile.response.status, 200);
      assert.equal(updatedProfile.payload.user.position, "GOALKEEPER");
      assert.equal(updatedProfile.payload.user.dominantFoot, "LEFT");
      assert.equal(updatedProfile.payload.user.phone, "+5493624998877");
      assert.equal(updatedProfile.payload.user.isPhoneVisible, true);
      assert.equal("passwordHash" in updatedProfile.payload.user, false);

      const visibleProfile = await request(`/users/${owner}/profile`, {
        cookie: viewerCookie,
      });
      assert.equal(visibleProfile.response.status, 200);
      assert.equal(visibleProfile.payload.phone, "+5493624998877");
      assertNoSensitiveProfileFields(visibleProfile.payload);

      const protectedFields = await request("/auth/me", {
        cookie: ownerCookie,
        method: "PATCH",
        body: {
          email: "attacker@example.com",
          password: "replacement-password",
          role: "ADMIN",
        },
      });
      assert.equal(protectedFields.response.status, 400);

      const unchanged = await models.User.findByPk(owner);
      assert.notEqual(unchanged.email, "attacker@example.com");
      assert.equal(unchanged.role, "PLAYER");

      const invalidPhone = await request("/auth/me", {
        cookie: ownerCookie,
        method: "PATCH",
        body: { phone: "no es un teléfono" },
      });
      assert.equal(invalidPhone.response.status, 400);

      const fieldOwner = await models.User.create({
        name: "Dueño de cancha",
        email: `profile-owner-role-${randomUUID()}@example.com`,
        passwordHash: `integration-hash-${randomUUID()}`,
        role: "FIELD_OWNER",
      });
      userIds.push(fieldOwner.id);
      const ownerRoleToken = createSessionToken();
      await models.Session.create({
        tokenHash: hashSessionToken(ownerRoleToken),
        userId: fieldOwner.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });
      cookies.set("field-owner", `findf5_session=${ownerRoleToken}`);

      const forbiddenSportsEdit = await request("/auth/me", {
        cookie: cookies.get("field-owner"),
        method: "PATCH",
        body: { position: "GOALKEEPER" },
      });
      assert.equal(forbiddenSportsEdit.response.status, 400);
    } finally {
      if (userIds.length > 0) {
        await models.Session.destroy({ where: { userId: userIds } });
        await models.User.destroy({ where: { id: userIds }, force: true });
      }

      if (server) {
        server.close();
        await once(server, "close");
      }
      await sequelize.close();
    }
  },
);
