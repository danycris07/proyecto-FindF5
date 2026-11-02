import assert from "node:assert/strict";
import test from "node:test";
import { publicProfile } from "../src/routes/users.routes.js";

test("el perfil público expone solo campos permitidos y reputación Nuevo", () => {
  const profile = publicProfile({
    id: 42,
    name: "Ana",
    email: "ana@example.com",
    passwordHash: "secret-hash",
    role: "PLAYER",
    position: "GOALKEEPER",
    dominantFoot: "LEFT",
    phone: "+5493624123456",
    isPhoneVisible: true,
    reputation: { attendanceRate: 92, attendance: 90 },
    sessions: [{ tokenHash: "secret-token" }],
  });

  assert.deepEqual(profile, {
    id: 42,
    name: "Ana",
    profileType: "Arquero",
    dominantFoot: "LEFT",
    reputation: { attendanceRate: null, label: "Nuevo" },
    phoneAvailable: true,
    phone: "+5493624123456",
  });
  assert.equal("email" in profile, false);
  assert.equal("passwordHash" in profile, false);
  assert.equal("sessions" in profile, false);
});

test("el perfil público oculta teléfono y datos deportivos que no aplican", () => {
  const profile = publicProfile({
    id: 43,
    name: "Club",
    role: "FIELD_OWNER",
    position: null,
    dominantFoot: "RIGHT",
    phone: "+5493624123456",
    isPhoneVisible: false,
  });

  assert.deepEqual(profile, {
    id: 43,
    name: "Club",
    profileType: "Dueño de cancha",
    dominantFoot: null,
    reputation: { attendanceRate: null, label: "Nuevo" },
    phoneAvailable: false,
  });
  assert.equal("phone" in profile, false);
});
