"use client";

import { chatTitleSchema } from "@/app/api/title/schema";
import { ChatInput } from "@/components/chat-input/chat-input";
import { AiMessage } from "@/components/messages/ai-message";
import { UserMessage } from "@/components/messages/user-message";
import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/ui/chat-container";
import { Loader } from "@/components/ui/loader";
import { Message } from "@/components/ui/message";
import { useInitialMessage } from "@/hooks/use-initial-message";
import { cn } from "@/lib/utils";
import { useChatTitleStore } from "@/stores/chat";
import { useChat, experimental_useObject as useObject } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const ChatView = () => {
  const [input, setInput] = useState("");
  const setTitle = useChatTitleStore((state) => state.setTitle);
  const { getStoredMessage, clearInitialMessage } = useInitialMessage();
  const { id } = useParams();
  const didRun = useRef(false);

  const { messages, status, stop, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    id: id as string,
  });

  const { submit } = useObject({
    api: "/api/title",
    schema: chatTitleSchema,
    onFinish: ({ object }) => {
      if (object?.title) {
        setTitle(object.title);
      }
    },
  });

  const handleSubmit = async () => {
    if (!input.trim()) return;
    await sendMessage({
      role: "user",
      parts: [{ type: "text", text: input.trim() }],
    });
    setInput("");
  };

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    setTitle("New Chat");

    const storedMessage = getStoredMessage();

    if (storedMessage) {
      sendMessage({
        role: "user",
        parts: [{ type: "text", text: storedMessage }],
      });
      submit(storedMessage);
      clearInitialMessage();
    }
  }, [getStoredMessage, clearInitialMessage, sendMessage]);

  return (
    <div className="relative flex h-full flex-col gap-4 border border-secondary rounded-lg py-4">
      <ChatContainerRoot className="flex-1">
        <ChatContainerContent className="flex flex-col gap-8">
          {messages.map((message, index) => {
            const isAssistant = message.role === "assistant";
            const isLastMessage = index === messages.length - 1;
            const isLoading =
              status === "submitted" &&
              messages.length > 0 &&
              messages[messages.length - 1].role === "user" &&
              isLastMessage;

            return (
              <Message
                key={message.id}
                className={cn(
                  "mx-auto flex w-full max-w-3xl flex-col gap-2 px-0 md:px-3",
                  isAssistant ? "items-start" : "items-end"
                )}
              >
                {isAssistant ? (
                  <AiMessage
                    message={message}
                    isStreaming={status === "streaming" && isLastMessage}
                  />
                ) : (
                  <UserMessage message={message} />
                )}

                {isLoading && (
                  <div className="group min-h-scroll-anchor flex w-full max-w-3xl flex-col items-start gap-2">
                    <Loader
                      variant="text-shimmer"
                      size="md"
                      text="Thinking..."
                    />
                  </div>
                )}
              </Message>
            );
          })}
        </ChatContainerContent>
      </ChatContainerRoot>
      <div className="flex justify-center px-3">
        <ChatInput
          inputAutoFocus={false}
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          isStreaming={status === "submitted" || status === "streaming"}
          stop={stop}
          placeholder="Ask follow up question..."
        />
      </div>
    </div>
  );
};
