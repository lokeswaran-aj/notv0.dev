import { Button } from "@/components/ui/button";
import { File } from "lucide-react";

import { TreeNodeType } from "@/types/message";
import { VerticalLine } from "./vertical-line";

type Props = {
  node: TreeNodeType;
  selectedFile: string | null;
  onFileSelect: (filePath: string) => void;
  level?: number;
};

export const FileNode = (props: Props) => {
  const { node, selectedFile, onFileSelect, level = 0 } = props;

  return (
    <VerticalLine level={level}>
      <Button
        variant="ghost"
        size="sm"
        className={`w-full justify-start h-8 px-2 font-normal relative ${
          selectedFile === node.filePath
            ? "bg-accent text-accent-foreground"
            : ""
        }`}
        onClick={() => node.filePath && onFileSelect(node.filePath)}
        style={{ paddingLeft: `${8 + level * 20}px` }}
      >
        <File className="h-4 w-4 mr-2" />
        {node.name}
      </Button>
    </VerticalLine>
  );
};
