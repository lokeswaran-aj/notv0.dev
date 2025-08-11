import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

type Props = {
  activeTab: string;
  hostUrl?: string;
};

export const ArtifaceActions = (props: Props) => {
  const { activeTab, hostUrl } = props;
  return (
    <div>
      {activeTab === "preview" && hostUrl && (
        <Button variant="link" asChild>
          <Link href={`${hostUrl}`} target="_blank">
            <ExternalLink className="w-4 h-4" />
          </Link>
        </Button>
      )}
    </div>
  );
};
