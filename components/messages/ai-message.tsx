import { cn } from "@/lib/utils";
import { UIMessage } from "ai";
import { MessageActions, MessageContent } from "../ui/message";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "../ui/reasoning";
import { CopyAction } from "../user-actions/copy-action";
import { RegenerateAction } from "./regenerate-action";

type Props = {
  message: UIMessage;
  isStreaming: boolean;
  regenerate: (messageId: string) => void;
};

export const AiMessage = (props: Props) => {
  const { message, isStreaming, regenerate } = props;

  return (
    <div className="group flex w-full flex-col gap-0">
      {message.parts.map((part, index) => {
        if (part.type === "text") {
          return (
            <MessageContent
              key={`${message.id}-${part.type}-${index}`}
              className="text-foreground prose dark:prose-invert w-full flex-1 rounded-lg bg-transparent p-0"
              markdown
            >
              {part.text}
            </MessageContent>
          );
        } else if (part.type === "reasoning") {
          return (
            <Reasoning
              isStreaming={isStreaming}
              key={`${message.id}-${part.type}-${index}`}
            >
              <ReasoningTrigger>Reasoning</ReasoningTrigger>
              <ReasoningContent
                markdown
                className="ml-2 border-l-2 border-l-slate-200 px-2 pb-1 dark:border-l-slate-700 prose dark:prose-invert"
              >
                {part.text}
              </ReasoningContent>
            </Reasoning>
          );
        }
      })}
      <MessageActions
        className={cn(
          "-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150",
          !isStreaming && "group-hover:opacity-100"
        )}
      >
        <CopyAction
          text={message.parts
            .filter((part) => part.type === "text")
            .map((part) => part.text)
            .join("")}
        />
        <RegenerateAction onClick={() => regenerate(message.id)} />
      </MessageActions>
    </div>
  );
};
