import { z } from "zod";

export const chatTitleSchema = z.object({
  title: z.string().max(100).describe("The title of the chat."),
});
