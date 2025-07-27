import { convertToUIMessages } from "@/lib/utils";
import {
  createChat,
  createMessage,
  getChatById,
  getMessagesByChatId,
} from "@/utils/supabase/actions";
import { createClient } from "@/utils/supabase/server";
import { anthropic, AnthropicProviderOptions } from "@ai-sdk/anthropic";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  smoothStream,
  streamText,
} from "ai";
import { NextRequest, NextResponse } from "next/server";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { generateTitleFromUserMessage } from "./actions";
import { systemPrompt } from "./prompt";

const postRequestBodySchema = z.object({
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
});

export const POST = async (req: NextRequest) => {
  let requestBody: z.infer<typeof postRequestBodySchema>;
  try {
    const json = await req.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }

  const { chatId, message } = requestBody;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 401 });
  }

  const chat = await getChatById(chatId);
  if (!chat) {
    const title = await generateTitleFromUserMessage(message.parts[0].text);
    await createChat(chatId, user.id, title);
  } else {
    if (chat.user_id !== user.id) {
      return NextResponse.json(
        { message: "You are not authorized to access this chat" },
        { status: 403 }
      );
    }
  }

  await createMessage(chatId, message);
  const messagesFromDb = await getMessagesByChatId(chatId);
  const uiMessages = messagesFromDb ? convertToUIMessages(messagesFromDb) : [];
  const modelMessages = convertToModelMessages(uiMessages);

  const response = createUIMessageStreamResponse({
    stream: createUIMessageStream({
      execute: ({ writer: dataStream }) => {
        const result = streamText({
          model: anthropic.languageModel("claude-3-7-sonnet-20250219"),
          system: systemPrompt,
          messages: modelMessages,
          providerOptions: {
            anthropic: {
              thinking: {
                type: "enabled",
                budgetTokens: 1024,
              },
            } satisfies AnthropicProviderOptions,
          },
          experimental_transform: smoothStream({ chunking: "word" }),
          onFinish: (result) => {
            console.dir(result.totalUsage, { depth: null });
          },
        });

        result.consumeStream();

        dataStream.merge(
          result.toUIMessageStream({
            sendReasoning: true,
          })
        );
      },
      generateId: uuidv7,
      onFinish: async ({ messages }) => {
        await Promise.all(
          messages.map(async (message) => {
            await createMessage(chatId, message);
          })
        );
      },
      onError: (error) => {
        console.error(error);
        return "Oops, an error occurred!";
      },
    }),
  });
  return response;
};
