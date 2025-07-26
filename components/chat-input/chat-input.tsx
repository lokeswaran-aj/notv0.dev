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
  inputAutoFocus?: boolean;
  input: string;
  setInput: (input: string) => void;
  isStreaming: boolean;
  onSubmit: () => void;
  stop?: () => void;
  placeholder?: string;
};

export const ChatInput = (props: Props) => {
  const {
    input,
    setInput,
    isStreaming,
    onSubmit,
    stop,
    inputAutoFocus = false,
    placeholder = "Can you build a modern AI SAAS landing page?",
  } = props;
  return (
    <PromptInput
      value={input}
      onValueChange={setInput}
      isLoading={isStreaming}
      onSubmit={onSubmit}
      className="w-full max-w-(--breakpoint-md) p-2"
      maxHeight={120}
    >
      <PromptInputTextarea
        placeholder={placeholder}
        className="dark:bg-background"
        autoFocus={inputAutoFocus}
      />
      <PromptInputActions className="justify-end pt-2">
        <PromptInputAction
          tooltip={isStreaming ? "Stop generation" : "Send message"}
        >
          {isStreaming ? (
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
