import { RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { MessageAction } from "../ui/message";

type Props = {
  onClick: () => void;
};
export const RegenerateAction = ({ onClick }: Props) => {
  return (
    <MessageAction tooltip="Regenerate" side="bottom" delayDuration={1000}>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={onClick}
      >
        <RefreshCw />
      </Button>
    </MessageAction>
  );
};
