import { Button } from "@/components/ui/button";
import { File } from "lucide-react";

import { cn } from "@/lib/utils";
import { useArtifact } from "@/stores/use-artifact";
import { TreeNodeType } from "@/types/data/code";
import { VerticalLine } from "./vertical-line";

type Props = {
  node: TreeNodeType;
  level?: number;
};

export const FileNode = (props: Props) => {
  const { node, level = 0 } = props;

  const selectedFilePath = useArtifact((state) => state.selectedFilePath);
  const setSelectedFilePath = useArtifact((state) => state.setSelectedFilePath);
  const files = useArtifact((state) => state.files);
  const setCode = useArtifact((state) => state.setCode);

  const handleFileSelect = (filePath: string) => {
    setSelectedFilePath(filePath);
    const code = files.find((file) => file.filePath === filePath)?.code;
    if (code) {
      setCode(code);
    }
  };

  return (
    <VerticalLine level={level}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "w-full justify-start h-8 px-2 font-normal relative hover:bg-secondary/30",
          selectedFilePath === node.filePath &&
            "bg-secondary/50 text-foreground"
        )}
        onClick={() => node.filePath && handleFileSelect(node.filePath)}
        style={{ paddingLeft: `${8 + level * 20}px` }}
      >
        <File className="h-4 w-4 mr-2" />
        {node.name}
      </Button>
    </VerticalLine>
  );
};
