import assert from "node:assert/strict";
import test from "node:test";
import {
  createMatchWhatsAppUrl,
  normalizeArgentinaWhatsAppPhone,
} from "./argentinaWhatsApp.js";

test("normaliza móviles argentinos nacionales e internacionales", () => {
  assert.equal(normalizeArgentinaWhatsAppPhone("+54 9 362 412-3456"), "5493624123456");
  assert.equal(normalizeArgentinaWhatsAppPhone("0362 4123456"), "5493624123456");
  assert.equal(normalizeArgentinaWhatsAppPhone("123"), null);
});

test("crea un enlace wa.me codificado y rechaza datos inválidos", () => {
  assert.equal(
    createMatchWhatsAppUrl("+5493624123456", "F5 Formosa & amigos"),
    "https://wa.me/5493624123456?text=Hola%2C%20te%20contacto%20por%20el%20partido%20F5%20Formosa%20%26%20amigos.",
  );
  assert.equal(createMatchWhatsAppUrl("123", "Partido"), null);
});
