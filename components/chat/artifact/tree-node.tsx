import { TreeNodeType } from "@/types/message";
import { FileNode } from "./file-node";
import { FolderNode } from "./folder-node";

type Props = {
  node: TreeNodeType;
  selectedFile: string | null;
  onFileSelect: (filePath: string) => void;
  level?: number;
};

export const TreeNode = (props: Props) => {
  const { node, selectedFile, onFileSelect, level = 0 } = props;

  if (node.type === "file") {
    return (
      <FileNode
        node={node}
        selectedFile={selectedFile}
        onFileSelect={onFileSelect}
        level={level}
      />
    );
  }

  return (
    <FolderNode
      node={node}
      selectedFile={selectedFile}
      onFileSelect={onFileSelect}
      level={level}
    />
  );
};
