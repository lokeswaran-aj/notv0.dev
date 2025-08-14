import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type Props = {
  hostUrl: string;
};

export const ExternalLinkButton = (props: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="link" asChild className="w-10 h-10">
          <Link href={props.hostUrl} target="_blank">
            <ExternalLink className="w-4 h-4" />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="center">
        <p>Open in new tab</p>
      </TooltipContent>
    </Tooltip>
  );
};
