"use client";

import { Button } from "@/components/ui/button";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { ArrowUp, Square } from "lucide-react";

type Props = {
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
  stop?: () => void;
};

export const ChatInput = (props: Props) => {
  const { input, setInput, isLoading, onSubmit, stop } = props;
  return (
    <PromptInput
      value={input}
      onValueChange={setInput}
      isLoading={isLoading}
      onSubmit={onSubmit}
      className="w-full max-w-(--breakpoint-md) p-4"
      maxHeight={120}
    >
      <PromptInputTextarea
        placeholder="Can you build a modern AI SAAS landing page?"
        className="dark:bg-background"
      />
      <PromptInputActions className="justify-end pt-2">
        <PromptInputAction
          tooltip={isLoading ? "Stop generation" : "Send message"}
        >
          {isLoading ? (
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => stop?.()}
            >
              <Square className="size-4 fill-current" />
            </Button>
          ) : (
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8 rounded-full"
              disabled={!input.trim()}
              onClick={onSubmit}
            >
              <ArrowUp className="size-5" />
            </Button>
          )}
        </PromptInputAction>
      </PromptInputActions>
    </PromptInput>
  );
};
