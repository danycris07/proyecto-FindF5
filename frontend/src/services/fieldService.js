import { mockFields } from "../mocks/MockData.js";
import {
  apiRequest,
  reportMockFallback,
  shouldUseMockFallback,
} from "./apiClient.js";

export async function getAvailableFields() {
  try {
    return await apiRequest("/fields");
  } catch (error) {
    if (!shouldUseMockFallback(error)) throw error;
    reportMockFallback("canchas", error);
    return mockFields.map(({ id, name, address }) => ({ id, name, address }));
  }
}
