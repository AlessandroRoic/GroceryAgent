import { healthResponseSchema, type HealthResponse } from "@grocery-agent/contracts";
import { apiErrorResponseSchema } from "@grocery-agent/contracts/error-response";

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch("/health");
  const body: unknown = await response.json();
  if (!response.ok) {
    const { message } = apiErrorResponseSchema.parse(body);
    throw new Error(`Health request failed with status ${response.status}: ${message}`);
  }

  return healthResponseSchema.parse(body);
}
