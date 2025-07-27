import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { MessageAction } from "../ui/message";

type Props = {
  message: string;
};
export const CopyMessageAction = ({ message }: Props) => {
  const [isCopied, setIsCopied] = useState(false);
  return (
    <MessageAction
      tooltip={isCopied ? "Copied" : "Copy"}
      side="bottom"
      delayDuration={1000}
    >
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={() => {
          navigator.clipboard.writeText(message);
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 2000);
        }}
      >
        {isCopied ? <Check /> : <Copy />}
      </Button>
    </MessageAction>
  );
};
