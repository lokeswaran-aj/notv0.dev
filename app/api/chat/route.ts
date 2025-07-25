import { anthropic, AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { convertToModelMessages, streamText } from "ai";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-3-7-sonnet-20250219"),
    system: "You are a helpful assistant.",
    messages: convertToModelMessages(messages),
    providerOptions: {
      anthropic: {
        thinking: {
          type: "enabled",
          budgetTokens: 1024,
        },
      } satisfies AnthropicProviderOptions,
    },
    onError: (error) => {
      console.error(error);
    },
  });
  return result.toUIMessageStreamResponse();
};
