import { cn } from "@/lib/utils";
import { UIMessage } from "ai";
import { Fragment } from "react";
import { MessageActions, MessageContent } from "../ui/message";
import { CopyMessageAction } from "./copy-message-action";

type Props = {
  message: UIMessage;
};

export const UserMessage = (props: Props) => {
  const { message } = props;

  return (
    <div className="group flex flex-col items-end gap-1">
      {message.parts.map((part, index) => {
        if (part.type === "text") {
          return (
            <Fragment key={`${message.id}-${part.type}-${index}`}>
              <MessageContent className="bg-muted min-w-fit text-primary max-w-[85%] rounded-3xl px-3 py-1.5 sm:max-w-[75%]">
                {part.text}
              </MessageContent>
              <MessageActions
                className={cn(
                  "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                )}
              >
                <CopyMessageAction />
              </MessageActions>
            </Fragment>
          );
        }
      })}
    </div>
  );
};
