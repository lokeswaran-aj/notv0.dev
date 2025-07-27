"use client";

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
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { v7 as uuidv7 } from "uuid";

type ChatViewProps = {
  initialMessages: UIMessage[];
  chatId: string;
};

export const ChatView = (props: ChatViewProps) => {
  const { initialMessages, chatId } = props;
  const [input, setInput] = useState("");
  const { getStoredMessage, clearInitialMessage } = useInitialMessage();
  const didRun = useRef(false);
  const storedMessage = getStoredMessage();

  const { messages, status, stop, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages, id, body }) {
        return {
          body: {
            chatId: id,
            message: messages.at(-1),
            ...body,
          },
        };
      },
    }),
    messages: initialMessages,
    id: chatId as string,
    onError: (error) => {
      console.error(error.message);
      const errorMessage = JSON.parse(error.message).message;
      toast.error(errorMessage);
    },
  });

  const handleSubmit = async () => {
    if (!input.trim()) return;
    await sendMessage({
      id: uuidv7(),
      role: "user",
      parts: [{ type: "text", text: input.trim() }],
    });
    setInput("");
  };

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    if (storedMessage) {
      const initialMessage: UIMessage = {
        id: uuidv7(),
        role: "user",
        parts: [{ type: "text", text: storedMessage }],
      };
      sendMessage(initialMessage);
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
              messages.at(-1)?.role === "user" &&
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
