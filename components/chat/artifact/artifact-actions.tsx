import { CopyAction } from "@/components/user-actions/copy-action";
import { ExternalLinkButton } from "@/components/user-actions/external-link";
import { useArtifact } from "@/stores/use-artifact";

type Props = {
  activeTab: string;
  hostUrl: string | null;
};

export const ArtifactActions = (props: Props) => {
  const { activeTab, hostUrl } = props;
  const code = useArtifact((state) => state.code);
  if (activeTab === "code") {
    return <CopyAction text={code} />;
  }
  if (hostUrl) {
    return <ExternalLinkButton hostUrl={hostUrl} />;
  }
  return <div className="w-10 h-10" />;
};
