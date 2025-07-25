import { Copy } from "lucide-react";
import { Button } from "../ui/button";
import { MessageAction } from "../ui/message";

export const CopyMessageAction = () => {
  return (
    <MessageAction tooltip="Copy" side="bottom" delayDuration={1000}>
      <Button variant="ghost" size="icon" className="rounded-full">
        <Copy />
      </Button>
    </MessageAction>
  );
};
