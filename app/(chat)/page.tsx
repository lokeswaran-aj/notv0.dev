"use client";

import { ChatInput } from "@/components/chat-input/chat-input";
import { useInitialMessage } from "@/stores/use-initial-message";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v7 as uuidv7 } from "uuid";

export default function ChatPage() {
  const router = useRouter();
  const { initialMessage, setInitialMessage } = useInitialMessage();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!initialMessage.trim()) return;

    setIsLoading(true);
    router.push(`/c/${uuidv7()}`);
    setIsLoading(false);
  };

  return (
    <main className="flex flex-col items-center gap-8 pt-80 h-[calc(100dvh-3.5rem)] w-full overflow-hidden">
      <h1 className="text-4xl font-bold">What can I help you build?</h1>
      <ChatInput
        inputAutoFocus={true}
        input={initialMessage}
        setInput={setInitialMessage}
        isStreaming={isLoading}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
