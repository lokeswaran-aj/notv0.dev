import { TreeNodeType } from "@/types/data/code";
import { FileNode } from "./file-node";
import { FolderNode } from "./folder-node";

type Props = {
  node: TreeNodeType;
  level?: number;
};

export const TreeNode = (props: Props) => {
  const { node, level = 0 } = props;

  if (node.type === "file") {
    return <FileNode node={node} level={level} />;
  }

  return <FolderNode node={node} level={level} />;
};
