import { ScrollArea } from "@/components/ui/scroll-area";
import { useFiles } from "@/stores/use-files";
import { buildTreeFromFiles } from "@/utils/files-tree-builder";
import { useEffect, useMemo, useState } from "react";
import { TreeNode } from "./tree-node";

export const FileTree = () => {
  const { files } = useFiles();
  const [filePaths, setFilePaths] = useState<string[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  useEffect(() => {
    if (!files || files.length === 0) return;

    files.forEach((file) => {
      if (file.filePath && file.code) {
        setFilePaths((prev) => [...prev, file.filePath ?? ""]);
        setSelectedFilePath(file.filePath ?? "");
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
    <div className="flex h-full w-full">
      {treeData.length > 0 && (
        <div className="w-full flex flex-col bg-background rounded-b-lg">
          <ScrollArea className="flex-1">
            <div className="p-2 relative">
              {treeData.map((node, index) => (
                <TreeNode
                  key={index}
                  node={node}
                  selectedFile={selectedFilePath}
                  onFileSelect={setSelectedFilePath}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
