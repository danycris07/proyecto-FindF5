import { mockFields } from "../mocks/MockData.js";

export async function getAvailableFields() {
  return mockFields.map(({ id, name, address }) => ({ id, name, address }));
}
