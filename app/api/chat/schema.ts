import { z } from "zod";

export const postRequestBodySchema = z.object({
  chatId: z.uuid(),
  message: z.object({
    id: z.uuid(),
    role: z.enum(["user"]),
    parts: z.array(
      z.object({
        type: z.enum(["text"]),
        text: z.string().min(1).max(2000),
      })
    ),
  }),
  modelId: z.string(),
  regenerate: z.boolean().optional(),
  regenerateFromMessageId: z.string().optional(),
});

export type postRequestBodyType = z.infer<typeof postRequestBodySchema>;
