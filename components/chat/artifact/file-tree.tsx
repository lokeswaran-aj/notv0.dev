import { ScrollArea } from "@/components/ui/scroll-area";
import { useFiles } from "@/stores/use-files";
import { buildTreeFromFiles } from "@/utils/files-tree-builder";
import { useMemo } from "react";
import { TreeNode } from "./tree-node";

export const FileTree = () => {
  const filePaths = useFiles((state) => state.filePaths);
  const memoizedFiles = useMemo(() => filePaths, [filePaths]);

  const treeData = useMemo(
    () => buildTreeFromFiles(memoizedFiles),
    [memoizedFiles]
  );
  return (
    <div className="flex h-full w-full">
      {treeData.length > 0 && (
        <div className="w-full flex flex-col bg-background rounded-b-lg">
          <ScrollArea className="flex-1">
            <div className="p-2 relative">
              {treeData.map((node, index) => (
                <TreeNode key={index} node={node} />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
