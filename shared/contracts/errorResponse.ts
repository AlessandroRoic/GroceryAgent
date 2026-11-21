import { z } from "zod";

export const apiErrorResponseSchema = z.strictObject({ message: z.string().min(1) });
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
