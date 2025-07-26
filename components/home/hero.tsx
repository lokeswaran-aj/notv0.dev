"use client";

import { useInitialMessage } from "@/hooks/use-initial-message";
import { useChatTitleStore } from "@/stores/chat";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatInput } from "../chat-input/chat-input";

export const Hero = () => {
  const router = useRouter();
  const { initialMessage, setInitialMessage } = useInitialMessage();
  const [isLoading, setIsLoading] = useState(false);
  const setTitle = useChatTitleStore((state) => state.setTitle);

  useEffect(() => {
    setTitle("New Chat");
  }, [setTitle]);

  const handleSubmit = () => {
    if (!initialMessage.trim()) return;

    setIsLoading(true);
    router.push(`/c/${crypto.randomUUID()}`);
    setIsLoading(false);
  };

  return (
    <main className="flex flex-col items-center gap-8 pt-80 h-dvh w-full overflow-hidden">
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
};
