import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";

export const generateTitleFromUserMessage = async (content: string) => {
  const { object } = await generateObject({
    model: anthropic("claude-3-5-haiku-latest"),
    system:
      "You are a helpful assistant. You will generate a short title based on the first message a user begins a conversation with. Ensure it is not more than 80 characters long. The title should be a summary of the user's message. Do not use quotes or colons.",
    prompt: content,
    schema: z.object({
      title: z.string().max(80).describe("The title of the chat."),
    }),
  });

  return object.title;
};
