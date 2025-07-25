"use client";

import { useInitialMessageStore } from "@/stores/initial-message";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatInput } from "../chat-input/chat-input";

export const Hero = () => {
  const setInitialMessage = useInitialMessageStore(
    (state) => state.setInitialMessage
  );
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setInitialMessage(input.trim());
    setInput("");
    router.push(`/c/${crypto.randomUUID()}`);
    setIsLoading(false);
  };

  return (
    <main className="flex flex-col items-center gap-8 pt-80 h-dvh w-full overflow-hidden">
      <h1 className="text-4xl font-bold">What can I help you build?</h1>
      <ChatInput
        inputAutoFocus={true}
        input={input}
        setInput={setInput}
        isStreaming={isLoading}
        onSubmit={handleSubmit}
      />
    </main>
  );
};
