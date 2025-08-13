import { ScrollArea } from "@/components/ui/scroll-area";
import { useFiles } from "@/stores/use-files";
import { buildTreeFromFiles } from "@/utils/files-tree-builder";
import { useEffect, useMemo, useState } from "react";
import { TreeNode } from "./tree-node";

export const FileTree = () => {
  const { files } = useFiles();
  const [filePaths, setFilePaths] = useState<string[]>([]);

  useEffect(() => {
    if (!files || files.length === 0) return;

    files.forEach((file) => {
      if (file.filePath && file.code) {
        setFilePaths((prev) => [...prev, file.filePath ?? ""]);
      }
    });
  }, [files]);

  const memoizedFiles: string[] = useMemo(() => {
    return filePaths;
  }, [filePaths]);

  const treeData = useMemo(
    () => buildTreeFromFiles(memoizedFiles),
    [memoizedFiles]
  );

  return (
    <div className="flex h-full w-full border-t border-secondary">
      {treeData.length > 0 && (
        <div className="w-64 flex flex-col border-r border-border bg-background">
          <ScrollArea className="flex-1">
            <div className="p-2 relative">
              {treeData.map((node, index) => (
                <TreeNode
                  key={index}
                  node={node}
                  selectedFile={null}
                  onFileSelect={() => {}}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
