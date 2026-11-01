import assert from "node:assert/strict";
import test from "node:test";
import {
  getMatchStatus,
  getMissingPlayers,
  getMatchResponse,
  isFutureMatch,
  normalizePublicMatchInput,
  normalizeMatchInput,
} from "../src/services/match-rules.js";

test("los cupos descuentan organizador, confirmados externos y participantes", () => {
  const match = {
    expectedPlayers: 10,
    organizerPlays: true,
    outsideSlots: 2,
  };
  assert.equal(getMissingPlayers(match, 3), 4);
  assert.equal(getMissingPlayers({ ...match, organizerPlays: false }, 3), 5);
  assert.equal(getMissingPlayers(match, 12), 0);
});

test("el estado se deriva de los cupos sin reabrir partidos cancelados", () => {
  const match = {
    expectedPlayers: 2,
    organizerPlays: true,
    outsideSlots: 0,
    status: "OPEN",
  };

  assert.equal(getMatchStatus(match, 0), "OPEN");
  assert.equal(getMatchStatus(match, 1), "COMPLETE");
  assert.equal(getMatchStatus({ ...match, status: "CANCELLED" }, 0), "CANCELLED");
});

test("la respuesta del partido incluye la imagen de su cancha asociada", () => {
  const response = getMatchResponse({
    id: 1,
    fieldId: 2,
    field: { name: "Cancha de prueba", imageUrl: "https://example.com/field.jpg" },
    expectedPlayers: 10,
    organizerPlays: true,
    outsideSlots: 0,
    participants: [],
    status: "OPEN",
  });

  assert.equal(response.fieldName, "Cancha de prueba");
  assert.equal(response.fieldImageUrl, "https://example.com/field.jpg");
});

test("la fecha del partido se interpreta en la zona horaria de Argentina", () => {
  assert.equal(
    isFutureMatch("2999-01-01", "00:00", new Date("2026-01-01T00:00:00Z")),
    true,
  );
  assert.equal(
    isFutureMatch("2000-01-01", "23:59", new Date("2026-01-01T00:00:00Z")),
    false,
  );
});

test("el formulario de partido conserva la coca y calcula el total", () => {
  assert.deepEqual(
    normalizeMatchInput({
      fieldName: "  Cancha  ",
      date: "2999-01-01",
      startTime: "21:00",
      expectedPlayers: 10,
      basePricePerPlayer: "1500",
      playingForCoca: true,
      cocaAmountPerPlayer: "200",
      organizerPlays: true,
      outsideSlots: 2,
    }),
    {
      fieldId: null,
      fieldName: "Cancha",
      date: "2999-01-01",
      startTime: "21:00",
      endTime: null,
      expectedPlayers: 10,
      organizerPlays: true,
      outsideSlots: 2,
      playingForCoca: true,
      basePricePerPlayer: 1500,
      cocaAmountPerPlayer: 200,
      pricePerPlayer: 1700,
    },
  );
});

test("la coca activa exige un importe positivo y los cupos no pueden exceder el total", () => {
  assert.throws(
    () =>
      normalizeMatchInput({
        fieldName: "Cancha",
        date: "2999-01-01",
        startTime: "21:00",
        expectedPlayers: 10,
        basePricePerPlayer: 0,
        playingForCoca: true,
        cocaAmountPerPlayer: 0,
      }),
    /monto extra/,
  );
  assert.throws(
    () =>
      normalizeMatchInput({
        fieldName: "Cancha",
        date: "2999-01-01",
        startTime: "21:00",
        expectedPlayers: 2,
        basePricePerPlayer: 0,
        organizerPlays: true,
        outsideSlots: 2,
      }),
    /más jugadores confirmados/,
  );
  assert.throws(
    () =>
      normalizeMatchInput({
        fieldName: "Cancha",
        date: "2999-01-01",
        startTime: "21:00",
        expectedPlayers: 10,
        basePricePerPlayer: 60000000,
        playingForCoca: true,
        cocaAmountPerPlayer: 50000000,
      }),
    /importe total/,
  );
});

test("los partidos públicos requieren entre 5 y 24 jugadores, cuota positiva y un cupo libre", () => {
  const validMatch = {
    fieldName: "Cancha",
    date: "2999-01-01",
    startTime: "21:00",
    expectedPlayers: 5,
    basePricePerPlayer: 1500,
    organizerPlays: true,
    outsideSlots: 3,
  };

  assert.equal(
    normalizePublicMatchInput(validMatch, { requireOpenSlot: true })
      .expectedPlayers,
    5,
  );
  assert.throws(
    () =>
      normalizePublicMatchInput(
        { ...validMatch, expectedPlayers: 4 },
        { requireOpenSlot: true },
      ),
    /entre 5 y 24/,
  );
  assert.throws(
    () =>
      normalizePublicMatchInput(
        { ...validMatch, expectedPlayers: 25 },
        { requireOpenSlot: true },
      ),
    /entre 5 y 24/,
  );
  assert.throws(
    () =>
      normalizePublicMatchInput(
        { ...validMatch, basePricePerPlayer: 0 },
        { requireOpenSlot: true },
      ),
    /mayor que 0/,
  );
  assert.throws(
    () =>
      normalizePublicMatchInput(
        { ...validMatch, basePricePerPlayer: 1500.5 },
        { requireOpenSlot: true },
      ),
    /importe entero/,
  );
  assert.throws(
    () =>
      normalizePublicMatchInput(
        {
          ...validMatch,
          playingForCoca: true,
          cocaAmountPerPlayer: 200.5,
        },
        { requireOpenSlot: true },
      ),
    /importe entero/,
  );
  assert.throws(
    () =>
      normalizePublicMatchInput(
        { ...validMatch, outsideSlots: 4 },
        { requireOpenSlot: true },
      ),
    /al menos un cupo disponible/,
  );
});
