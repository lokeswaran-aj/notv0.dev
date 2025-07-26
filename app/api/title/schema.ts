import { z } from "zod";

export const chatTitleSchema = z.object({
  title: z.string().max(255).describe("The title of the chat."),
});
