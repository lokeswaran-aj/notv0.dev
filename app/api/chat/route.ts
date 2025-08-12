import { AI_MODELS, SharedV2ProviderOptions } from "@/lib/models";
import { convertToUIMessages } from "@/lib/utils";
import { openai } from "@ai-sdk/openai";

import {
  createArtifact,
  createChat,
  createMessage,
  deleteMessagesAfter,
  getChatById,
  getMessagesByChatId,
} from "@/utils/supabase/actions";
import { createClient } from "@/utils/supabase/server";
import { anthropic } from "@ai-sdk/anthropic";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  smoothStream,
  stepCountIs,
  streamText,
} from "ai";
import { NextRequest, NextResponse } from "next/server";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { generateTitleFromUserMessage } from "./actions";
import { generalSystemPrompt } from "./prompt";
import { codeGenerator } from "./tools/code-generator";

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
  modelId: z.string(),
  regenerate: z.boolean().optional(),
  regenerateFromMessageId: z.string().optional(),
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

  const { chatId, message, modelId, regenerate, regenerateFromMessageId } =
    requestBody;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 401 });
  }

  const chat = await getChatById(chatId);
  let title = "";
  if (!chat) {
    title = await generateTitleFromUserMessage(message.parts[0].text);
    await createChat(chatId, user.id, title);
    await createArtifact(chatId);
  } else {
    title = chat.title;
    if (chat.user_id !== user.id) {
      return NextResponse.json(
        { message: "You are not authorized to access this chat" },
        { status: 403 }
      );
    }
  }

  if (regenerate && regenerateFromMessageId) {
    await deleteMessagesAfter(chatId, regenerateFromMessageId);
  } else {
    await createMessage(chatId, message);
  }

  const messagesFromDb = await getMessagesByChatId(chatId);
  const uiMessages = messagesFromDb ? convertToUIMessages(messagesFromDb) : [];
  const modelMessages = convertToModelMessages(uiMessages);

  const selectedModel = AI_MODELS.find((m) => m.id === modelId);
  if (!selectedModel) {
    return NextResponse.json({ message: "Model not found" }, { status: 404 });
  }

  let model = null;
  let providerOptions: SharedV2ProviderOptions | undefined = undefined;
  switch (selectedModel.provider) {
    case "Anthropic":
      model = anthropic(modelId);
      providerOptions = selectedModel.providerOptions ?? undefined;
      break;
    case "OpenAI":
      model = openai(modelId);
      providerOptions = selectedModel.providerOptions ?? undefined;
      break;
    default:
      model = anthropic("claude-3-5-sonnet-latest");
  }

  const stream = createUIMessageStream({
    execute: async ({ writer: dataStream }) => {
      const result = streamText({
        model,
        providerOptions,
        temperature: 1,
        system: generalSystemPrompt,
        messages: modelMessages,
        tools: {
          codeGenerator: codeGenerator({
            dataStream,
            chatId,
            model,
          }),
        },
        experimental_transform: smoothStream({ chunking: "word" }),
        onFinish: (result) => {
          console.log("chatUsage:");
          console.dir(result.totalUsage, { depth: null });
        },
        stopWhen: stepCountIs(5),
      });

      dataStream.write({
        type: "data-title",
        data: {
          title: title || "New Chat",
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
  });
  return createUIMessageStreamResponse({
    stream,
  });
};
