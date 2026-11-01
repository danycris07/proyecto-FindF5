import assert from "node:assert/strict";
import test from "node:test";
import {
  createReverseGeocoder,
  ReverseGeocodeError,
} from "../src/services/reverse-geocode.js";

function response(address, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    json: async () => (address ? { display_name: address } : {}),
  };
}

test("resuelve la dirección en español y devuelve el nombre completo del lugar", async () => {
  let requestUrl;
  const reverse = createReverseGeocoder({
    fetchImpl: async (url) => {
      requestUrl = url;
      return response("Avenida Antártida Argentina, Formosa, Argentina");
    },
  });

  assert.equal(
    await reverse(-26.18, -58.17),
    "Avenida Antártida Argentina, Formosa, Argentina",
  );
  assert.equal(requestUrl.searchParams.get("lat"), "-26.18");
  assert.equal(requestUrl.searchParams.get("lon"), "-58.17");
  assert.equal(requestUrl.searchParams.get("zoom"), "18");
});

test("cachea las coordenadas y limita solicitudes consecutivas a una por segundo", async () => {
  let clock = 0;
  const requestTimes = [];
  const reverse = createReverseGeocoder({
    now: () => clock,
    wait: async (milliseconds) => {
      clock += milliseconds;
    },
    fetchImpl: async () => {
      requestTimes.push(clock);
      return response("Formosa, Argentina");
    },
  });

  await Promise.all([
    reverse(-26.18, -58.17),
    reverse(-26.2, -58.2),
  ]);
  await reverse(-26.18, -58.17);

  assert.deepEqual(requestTimes, [0, 1000]);
});

test("valida las coordenadas y maneja lugares sin dirección", async () => {
  const reverse = createReverseGeocoder({
    fetchImpl: async () => response(null, { ok: false, status: 404 }),
  });

  await assert.rejects(reverse(91, 0), {
    name: "ReverseGeocodeError",
    status: 400,
  });
  assert.equal(await reverse(-26.18, -58.17), null);
});

test("propaga la limitación temporal del servicio de mapas", async () => {
  const reverse = createReverseGeocoder({
    fetchImpl: async () => response(null, { ok: false, status: 429 }),
  });

  await assert.rejects(reverse(-26.18, -58.17), (error) => {
    assert.ok(error instanceof ReverseGeocodeError);
    assert.equal(error.status, 503);
    assert.match(error.message, /limitó temporalmente/);
    return true;
  });
});
