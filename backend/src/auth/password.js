import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);

  return `scrypt$${salt.toString("base64url")}$${derivedKey.toString("base64url")}`;
}

export async function verifyPassword(password, encodedHash) {
  if (typeof encodedHash !== "string") {
    return false;
  }

  const [algorithm, encodedSalt, encodedKey, extra] = encodedHash.split("$");
  if (algorithm !== "scrypt" || !encodedSalt || !encodedKey || extra) {
    return false;
  }

  let salt;
  let expectedKey;
  try {
    salt = Buffer.from(encodedSalt, "base64url");
    expectedKey = Buffer.from(encodedKey, "base64url");
  } catch {
    return false;
  }
  if (salt.length !== 16 || expectedKey.length !== KEY_LENGTH) {
    return false;
  }

  const actualKey = await scrypt(password, salt, KEY_LENGTH);
  return timingSafeEqual(actualKey, expectedKey);
}
