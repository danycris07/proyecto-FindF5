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
import { createAdminRouter } from "../src/routes/admin.routes.js";

const enabled = process.env.RUN_DB_INTEGRATION_TESTS === "1";

function futureDateInArgentina() {
  const date = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

test(
  "la administración permite gestionar usuarios, canchas y partidos",
  { skip: !enabled },
  async () => {
    const { sequelize, models } = await import("../src/database/index.js");
    const createdUserIds = [];
    const createdFieldIds = [];
    const createdMatchIds = [];
    let server;

    try {
      await sequelize.authenticate();
      await sequelize.sync({ alter: false, force: false });

      const createUser = async (label, role) => {
        const user = await models.User.create({
          name: `Admin test ${label}`,
          email: `admin-test-${label}-${randomUUID()}@example.com`,
          passwordHash: "integration-test-only",
          role,
        });
        createdUserIds.push(user.id);
        return user;
      };

      const admin = await createUser("admin", "ADMIN");
      const player = await createUser("player", "PLAYER");
      const fieldOwner = await createUser("field-owner", "FIELD_OWNER");
      const adminToken = createSessionToken();
      const playerToken = createSessionToken();
      await models.Session.bulkCreate([
        {
          tokenHash: hashSessionToken(adminToken),
          userId: admin.id,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
        {
          tokenHash: hashSessionToken(playerToken),
          userId: player.id,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      ]);

      const app = createApp({
        adminRouter: createAdminRouter({ models, sequelize }),
      });
      server = app.listen(0);
      await once(server, "listening");
      const address = server.address();
      assert.ok(address && typeof address === "object");
      const baseUrl = `http://127.0.0.1:${address.port}/api/admin`;
      const request = async (path, { actor, method = "GET", body } = {}) => {
        const token = actor === "admin" ? adminToken : playerToken;
        const response = await fetch(`${baseUrl}${path}`, {
          method,
          headers: {
            ...(actor ? { Cookie: `findf5_session=${token}` } : {}),
            ...(body ? { "Content-Type": "application/json" } : {}),
          },
          ...(body ? { body: JSON.stringify(body) } : {}),
        });
        return {
          response,
          payload: response.status === 204 ? null : await response.json(),
        };
      };

      assert.equal((await request("/users")).response.status, 401);
      assert.equal(
        (await request("/users", { actor: "player" })).response.status,
        403,
      );
      const userList = await request("/users", { actor: "admin" });
      assert.equal(userList.response.status, 200);
      assert.ok(userList.payload.some((user) => user.id === player.id));
      assert.equal("passwordHash" in userList.payload[0], false);

      const createdUser = await request("/users", {
        actor: "admin",
        method: "POST",
        body: {
          name: "Usuario administrado",
          email: `managed-${randomUUID()}@example.com`,
          password: "secure-password",
          role: "PLAYER",
          position: "GOALKEEPER",
        },
      });
      assert.equal(createdUser.response.status, 201);
      const managedUserId = createdUser.payload.user.id;
      createdUserIds.push(managedUserId);
      assert.equal(createdUser.payload.user.position, "GOALKEEPER");
      assert.equal("passwordHash" in createdUser.payload.user, false);
      const managedToken = createSessionToken();
      await models.Session.create({
        tokenHash: hashSessionToken(managedToken),
        userId: managedUserId,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });

      const updatedUser = await request(`/users/${managedUserId}`, {
        actor: "admin",
        method: "PUT",
        body: {
          name: "Usuario convertido",
          email: createdUser.payload.user.email,
          role: "FIELD_OWNER",
          password: "new-secure-password",
        },
      });
      assert.equal(updatedUser.response.status, 200);
      assert.equal(updatedUser.payload.user.position, null);
      assert.equal(updatedUser.payload.user.role, "FIELD_OWNER");
      assert.equal(
        await models.Session.count({ where: { userId: managedUserId } }),
        0,
      );

      const selfUpdate = await request(`/users/${admin.id}`, {
        actor: "admin",
        method: "PUT",
        body: {
          name: admin.name,
          email: admin.email,
          role: "PLAYER",
        },
      });
      assert.equal(selfUpdate.response.status, 409);
      assert.equal(
        (await request(`/users/${admin.id}`, {
          actor: "admin",
          method: "DELETE",
        })).response.status,
        409,
      );

      const invalidFieldOwner = await request("/fields", {
        actor: "admin",
        method: "POST",
        body: {
          name: "Cancha con dueño inválido",
          address: "Dirección de prueba",
          ownerId: player.id,
        },
      });
      assert.equal(invalidFieldOwner.response.status, 422);

      const field = await request("/fields", {
        actor: "admin",
        method: "POST",
        body: {
          name: "Cancha administrada",
          address: "Dirección de prueba",
          ownerId: fieldOwner.id,
          latitude: -34.6,
          longitude: -58.4,
          price: 25000,
        },
      });
      assert.equal(field.response.status, 201);
      const fieldId = field.payload.field.id;
      createdFieldIds.push(fieldId);

      const updatedField = await request(`/fields/${fieldId}`, {
        actor: "admin",
        method: "PUT",
        body: {
          name: "Cancha actualizada",
          address: "Nueva dirección",
          ownerId: fieldOwner.id,
          price: 27000,
        },
      });
      assert.equal(updatedField.response.status, 200);
      assert.equal(updatedField.payload.field.name, "Cancha actualizada");
      assert.equal(
        (await request("/fields", { actor: "player" })).response.status,
        403,
      );

      const match = await request("/matches", {
        actor: "admin",
        method: "POST",
        body: {
          fieldName: "Cancha de partido",
          date: futureDateInArgentina(),
          startTime: "23:59",
          expectedPlayers: 4,
          organizerId: player.id,
          organizerPlays: true,
          basePricePerPlayer: 1500,
          playingForCoca: false,
        },
      });
      assert.equal(match.response.status, 201);
      const matchId = match.payload.match.id;
      createdMatchIds.push(matchId);
      assert.equal(match.payload.match.organizerId, player.id);

      const updatedMatch = await request(`/matches/${matchId}`, {
        actor: "admin",
        method: "PUT",
        body: {
          fieldName: "Cancha de partido editada",
          date: futureDateInArgentina(),
          startTime: "22:00",
          expectedPlayers: 5,
          organizerPlays: true,
          basePricePerPlayer: 1600,
          playingForCoca: false,
        },
      });
      assert.equal(updatedMatch.response.status, 200);
      assert.equal(updatedMatch.payload.match.expectedPlayers, 5);
      assert.equal(
        (await request(`/matches/${matchId}`, { actor: "admin" })).response.status,
        200,
      );

      assert.equal(
        (await request(`/users/${managedUserId}`, {
          actor: "admin",
          method: "DELETE",
        })).response.status,
        204,
      );
      assert.equal(
        (await request(`/users/${managedUserId}`, { actor: "admin" })).response
          .status,
        404,
      );
      assert.equal(
        (await request(`/fields/${fieldId}`, {
          actor: "admin",
          method: "DELETE",
        })).response.status,
        204,
      );
      assert.equal(
        (await request(`/matches/${matchId}`, {
          actor: "admin",
          method: "DELETE",
        })).response.status,
        204,
      );
      assert.equal(
        (await request(`/matches/${matchId}`, { actor: "admin" })).response
          .status,
        404,
      );
    } finally {
      if (createdMatchIds.length) {
        await models.MatchParticipant.destroy({
          where: { matchId: createdMatchIds },
        });
        await models.Match.destroy({
          where: { id: createdMatchIds },
          force: true,
        });
      }
      if (createdFieldIds.length) {
        await models.Field.destroy({
          where: { id: createdFieldIds },
          force: true,
        });
      }
      if (createdUserIds.length) {
        await models.Session.destroy({ where: { userId: createdUserIds } });
        await models.User.destroy({
          where: { id: createdUserIds },
          force: true,
        });
      }
      if (server) {
        server.close();
        await once(server, "close");
      }
      await sequelize.close();
    }
  },
);
