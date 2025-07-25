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
import { cn } from "@/lib/utils";
import { useInitialMessageStore } from "@/stores/initial-message";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const ChatView = () => {
  const [input, setInput] = useState("");
  const initialMessage = useInitialMessageStore(
    (state) => state.initialMessage
  );
  const setInitialMessage = useInitialMessageStore(
    (state) => state.setInitialMessage
  );
  const { id } = useParams();
  const didRun = useRef(false);
  const { messages, status, stop, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    id: id as string,
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

    if (initialMessage) {
      sendMessage({
        role: "user",
        parts: [{ type: "text", text: initialMessage }],
      });
      setInitialMessage(null);
    }
  }, []);

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
                  "mx-auto flex w-full max-w-3xl flex-col gap-2 px-0 md:px-6",
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
      <div className="px-4">
        <ChatInput
          inputAutoFocus={false}
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          isStreaming={status === "submitted" || status === "streaming"}
          stop={stop}
        />
      </div>
    </div>
  );
};
