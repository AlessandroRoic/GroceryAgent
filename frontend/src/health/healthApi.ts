import { healthResponseSchema, type HealthResponse } from "@grocery-agent/contracts";

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch("/health");
  if (!response.ok) {
    throw new Error(`Health request failed with status ${response.status}`);
  }

  const body: unknown = await response.json();
  return healthResponseSchema.parse(body);
}
