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

export const codeGenerationOutputSchema = z.object({
  files: z
    .array(
      z.object({
        filePath: z
          .string()
          .describe("The relative path to the file to be created"),
        code: z
          .string()
          .describe(
            "The code to be written to the file. Do not wrap with backticks"
          ),
      })
    )
    .describe("The files to be created or updated"),
  summary: z
    .string()
    .describe("A summary of the changes made to the code.")
    .max(500),
});

export type postRequestBodyType = z.infer<typeof postRequestBodySchema>;

export type codeGenerationOutputType = z.infer<
  typeof codeGenerationOutputSchema
>;
