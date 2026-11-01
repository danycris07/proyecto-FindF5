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
import { createMatchesRouter } from "../src/routes/matches.routes.js";
import { createFieldsRouter } from "../src/routes/fields.routes.js";

const enabled = process.env.RUN_DB_INTEGRATION_TESTS === "1";

function futureDateInArgentina(daysAhead = 5) {
  const date = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
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
  "partidos y participación validan permisos, cupos y concurrencia con MySQL",
  { skip: !enabled },
  async () => {
    const { sequelize, models } = await import("../src/database/index.js");
    const createdUserIds = [];
    const createdMatchIds = [];
    const createdFieldIds = [];
    const credentials = new Map();
    let server;

    try {
      await sequelize.authenticate();
      await sequelize.sync({ alter: false, force: false });

      for (const label of [
        "organizer",
        "player-a",
        "player-b",
        "stranger",
        "field-owner",
      ]) {
        const user = await models.User.create({
          name: `Match ${label}`,
          email: `match-${label}-${randomUUID()}@example.com`,
          passwordHash: "integration-test-only",
          role: label === "field-owner" ? "FIELD_OWNER" : "PLAYER",
        });
        createdUserIds.push(user.id);
        const token = createSessionToken();
        await models.Session.create({
          tokenHash: hashSessionToken(token),
          userId: user.id,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        });
        credentials.set(label, {
          user,
          cookie: `findf5_session=${token}`,
        });
      }

      const field = await models.Field.create({
        name: `Cancha de prueba ${randomUUID()}`,
        address: "Dirección de prueba",
        imageUrl: "https://example.com/cancha-prueba.jpg",
        ownerId: credentials.get("field-owner").user.id,
      });
      createdFieldIds.push(field.id);

      const app = createApp({
        fieldsRouter: createFieldsRouter({ models }),
        matchesRouter: createMatchesRouter({ models, sequelize }),
      });
      server = app.listen(0);
      await once(server, "listening");
      const address = server.address();
      assert.ok(address && typeof address === "object");
      const baseUrl = `http://127.0.0.1:${address.port}/api/matches`;
      const request = async (path, { actor, method = "GET", body } = {}) => {
        const response = await fetch(`${baseUrl}${path}`, {
          method,
          headers: {
            ...(actor ? { Cookie: credentials.get(actor).cookie } : {}),
            ...(body ? { "Content-Type": "application/json" } : {}),
          },
          ...(body ? { body: JSON.stringify(body) } : {}),
        });
        const payload =
          response.status === 204 ? null : await response.json();
        return { response, payload };
      };
      const validMatch = {
        fieldName: `Cancha de prueba ${randomUUID()}`,
        date: futureDateInArgentina(),
        startTime: "23:59",
        endTime: "23:59:30",
        expectedPlayers: 5,
        playingForCoca: true,
        basePricePerPlayer: 1500,
        cocaAmountPerPlayer: 200,
        organizerPlays: true,
        outsideSlots: 3,
      };

      const anonymous = await request("/");
      assert.equal(anonymous.response.status, 401);

      const fieldsResponse = await fetch(
        `http://127.0.0.1:${address.port}/api/fields`,
        { headers: { Cookie: credentials.get("organizer").cookie } },
      );
      assert.equal(fieldsResponse.status, 200);
      assert.ok(
        (await fieldsResponse.json()).some(
          (item) =>
            item.id === field.id &&
            item.name === field.name &&
            item.imageUrl === field.imageUrl,
        ),
      );

      const pastMatch = await request("/", {
        actor: "organizer",
        method: "POST",
        body: { ...validMatch, date: "2000-01-01" },
      });
      assert.equal(pastMatch.response.status, 422);
      assert.equal(pastMatch.payload.field, "date");

      const ownerCreate = await request("/", {
        actor: "field-owner",
        method: "POST",
        body: validMatch,
      });
      assert.equal(ownerCreate.response.status, 403);

      const tooFewPlayers = await request("/", {
        actor: "organizer",
        method: "POST",
        body: { ...validMatch, expectedPlayers: 4 },
      });
      assert.equal(tooFewPlayers.response.status, 400);

      const tooManyPlayers = await request("/", {
        actor: "organizer",
        method: "POST",
        body: { ...validMatch, expectedPlayers: 25 },
      });
      assert.equal(tooManyPlayers.response.status, 400);

      const zeroPrice = await request("/", {
        actor: "organizer",
        method: "POST",
        body: { ...validMatch, basePricePerPlayer: 0 },
      });
      assert.equal(zeroPrice.response.status, 400);

      const decimalPrice = await request("/", {
        actor: "organizer",
        method: "POST",
        body: { ...validMatch, basePricePerPlayer: 1500.5 },
      });
      assert.equal(decimalPrice.response.status, 400);
      assert.ok(
        decimalPrice.payload.errors.some(
          ({ field }) => field === "basePricePerPlayer",
        ),
      );

      const decimalCocaAmount = await request("/", {
        actor: "organizer",
        method: "POST",
        body: { ...validMatch, cocaAmountPerPlayer: 200.5 },
      });
      assert.equal(decimalCocaAmount.response.status, 400);

      const noOpenSlots = await request("/", {
        actor: "organizer",
        method: "POST",
        body: { ...validMatch, outsideSlots: 4 },
      });
      assert.equal(noOpenSlots.response.status, 422);
      assert.equal(noOpenSlots.payload.field, "outsideSlots");

      const created = await request("/", {
        actor: "organizer",
        method: "POST",
        body: { ...validMatch, fieldId: field.id },
      });
      assert.equal(created.response.status, 201);
      const matchId = created.payload.match.id;
      createdMatchIds.push(matchId);
      assert.equal(created.payload.match.fieldImageUrl, field.imageUrl);
      assert.equal(created.payload.match.missingPlayers, 1);
      assert.equal(created.payload.match.pricePerPlayer, 1700);
      assert.equal(created.payload.match.participants.length, 0);

      const detail = await request(`/${matchId}`, { actor: "player-a" });
      assert.equal(detail.response.status, 200);
      assert.equal(detail.payload.match.organizerName, "Match organizer");

      const mine = await request("/mine", { actor: "organizer" });
      assert.ok(mine.payload.some((match) => match.id === matchId));

      const forbiddenEdit = await request(`/${matchId}`, {
        actor: "stranger",
        method: "PUT",
        body: { ...validMatch, fieldName: "Cancha modificada" },
      });
      assert.equal(forbiddenEdit.response.status, 403);

      const organizerJoin = await request(`/${matchId}/join`, {
        actor: "organizer",
        method: "POST",
      });
      assert.equal(organizerJoin.response.status, 409);

      const joinAttempts = await Promise.all([
        request(`/${matchId}/join`, {
          actor: "player-a",
          method: "POST",
        }),
        request(`/${matchId}/join`, {
          actor: "player-b",
          method: "POST",
        }),
      ]);
      assert.deepEqual(
        joinAttempts.map(({ response }) => response.status).sort(),
        [200, 409],
      );
      const joined = joinAttempts.find(({ response }) => response.status === 200);
      assert.equal(joined.payload.match.missingPlayers, 0);
      assert.equal(joined.payload.match.status, "COMPLETE");
      assert.equal(joined.payload.match.participants.length, 1);

      const fullList = await request("/", { actor: "player-a" });
      assert.equal(
        fullList.payload.some((match) => match.id === matchId),
        false,
      );

      const winner = joinAttempts.find(
        ({ response }) => response.status === 200,
      );
      const winnerLabel =
        winner.payload.match.participants[0].userId ===
        credentials.get("player-a").user.id
          ? "player-a"
          : "player-b";
      const duplicateJoin = await request(`/${matchId}/join`, {
        actor: winnerLabel,
        method: "POST",
      });
      assert.equal(duplicateJoin.response.status, 409);

      const left = await request(`/${matchId}/join`, {
        actor: winnerLabel,
        method: "DELETE",
      });
      assert.equal(left.response.status, 200);
      assert.equal(left.payload.match.missingPlayers, 1);
      assert.equal(left.payload.match.status, "OPEN");

      const repeatedLeave = await request(`/${matchId}/join`, {
        actor: winnerLabel,
        method: "DELETE",
      });
      assert.equal(repeatedLeave.response.status, 409);

      const updated = await request(`/${matchId}`, {
        actor: "organizer",
        method: "PUT",
        body: {
          ...validMatch,
          fieldName: "Cancha actualizada",
          date: futureDateInArgentina(6),
          expectedPlayers: 5,
          outsideSlots: 3,
        },
      });
      assert.equal(updated.response.status, 200);
      assert.equal(updated.payload.match.fieldName, "Cancha actualizada");
      assert.equal(updated.payload.match.missingPlayers, 1);

      const outsideSlot = await request(`/${matchId}/outside-slots`, {
        actor: "organizer",
        method: "POST",
      });
      assert.equal(outsideSlot.response.status, 200);
      assert.equal(outsideSlot.payload.match.outsideSlots, 4);
      assert.equal(outsideSlot.payload.match.missingPlayers, 0);
      assert.equal(outsideSlot.payload.match.status, "COMPLETE");

      const extraOutsideSlot = await request(`/${matchId}/outside-slots`, {
        actor: "organizer",
        method: "POST",
      });
      assert.equal(extraOutsideSlot.response.status, 409);

      const forbiddenDelete = await request(`/${matchId}`, {
        actor: "stranger",
        method: "DELETE",
      });
      assert.equal(forbiddenDelete.response.status, 403);

      const deleted = await request(`/${matchId}`, {
        actor: "organizer",
        method: "DELETE",
      });
      assert.equal(deleted.response.status, 204);
      const missing = await request(`/${matchId}`, { actor: "organizer" });
      assert.equal(missing.response.status, 404);
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
