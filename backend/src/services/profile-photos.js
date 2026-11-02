import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

export const PROFILE_PHOTO_DIRECTORY = fileURLToPath(
  new URL("../../uploads/profile-photos/", import.meta.url),
);
export const PROFILE_PHOTO_PATH = "/api/uploads/profile-photos";

export async function ensureProfilePhotoDirectory() {
  await mkdir(PROFILE_PHOTO_DIRECTORY, { recursive: true });
}

export function getProfilePhotoFilePath(photoUrl) {
  if (typeof photoUrl !== "string" || !photoUrl.startsWith(`${PROFILE_PHOTO_PATH}/`)) {
    return null;
  }

  const filename = path.basename(photoUrl.slice(PROFILE_PHOTO_PATH.length + 1));
  if (!filename || filename !== photoUrl.slice(PROFILE_PHOTO_PATH.length + 1)) return null;
  return path.join(PROFILE_PHOTO_DIRECTORY, filename);
}

export function defaultProfilePhotoUrl(userId) {
  const numericId = Number(userId);
  const safeId = Number.isSafeInteger(numericId) && numericId > 0 ? numericId : 1;
  const photoNumber = ((safeId * 37) % 70) + 1;
  return `https://i.pravatar.cc/240?img=${photoNumber}`;
}
