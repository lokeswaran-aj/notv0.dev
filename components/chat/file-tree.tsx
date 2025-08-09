import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDataStream } from "@/stores/use-data-stream";
import { Check, ChevronRight, Copy, File, Folder } from "lucide-react";
import React, { useState } from "react";
import { CodeBlock, CodeBlockCode } from "../ui/code-block";

type CodeFile = {
  filePath: string;
  code: string;
};

type TreeNode = {
  name: string;
  type: "file" | "folder";
  children?: TreeNode[];
  filePath?: string;
};

function buildTreeFromFiles(files: CodeFile[]): TreeNode[] {
  const root: TreeNode[] = [];

  files.forEach(({ filePath }) => {
    const parts = filePath.split("/");
    let currentLevel = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const existingNode = currentLevel.find((node) => node.name === part);

      if (existingNode) {
        if (!isFile && existingNode.type === "folder") {
          currentLevel = existingNode.children!;
        }
      } else {
        const newNode: TreeNode = {
          name: part,
          type: isFile ? "file" : "folder",
          filePath: isFile ? filePath : undefined,
          children: isFile ? undefined : [],
        };

        currentLevel.push(newNode);

        if (!isFile) {
          currentLevel = newNode.children!;
        }
      }
    });
  });

  return root;
}

export const FileTree = () => {
  const { dataStream } = useDataStream();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const files: CodeFile[] = React.useMemo(() => {
    return dataStream.code || [];
  }, [dataStream.code]);

  const treeData = React.useMemo(() => buildTreeFromFiles(files), [files]);

  const selectedFileData = React.useMemo(() => {
    if (!selectedFile) return null;
    return files.find((file) => file.filePath === selectedFile);
  }, [selectedFile, files]);

  React.useEffect(() => {
    if (files.length > 0 && !selectedFile) {
      setSelectedFile(files[0].filePath);
    }
  }, [files, selectedFile]);

  return (
    <div className="flex h-full w-full">
      {/* File Sidebar */}
      <div className="w-64 flex flex-col border-r border-border bg-background">
        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
          <div className="flex gap-2">
            <p className="text-sm font-medium">Files ({files.length})</p>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 relative">
            {treeData.map((node, index) => (
              <TreeNode
                key={index}
                node={node}
                selectedFile={selectedFile}
                onFileSelect={setSelectedFile}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {files.length > 0 && selectedFile ? (
              <p className="text-foreground text-sm">{selectedFile}</p>
            ) : null}
          </div>
          {files.length > 0 && selectedFileData && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                navigator.clipboard.writeText(selectedFileData.code);
                setIsCopied(true);
                setTimeout(() => {
                  setIsCopied(false);
                }, 2000);
              }}
              title={isCopied ? "Copied!" : "Copy file content"}
            >
              {isCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          {files.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No code has been generated yet
              </p>
            </div>
          ) : selectedFileData ? (
            <div className="h-full w-full bg-background">
              <CodeBlock className="h-full w-full overflow-hidden border-0 rounded-none bg-background">
                <CodeBlockCode
                  theme="github-dark-default"
                  code={selectedFileData.code}
                  language="tsx"
                  className="h-full w-full overflow-auto bg-background [&>pre]:whitespace-pre-wrap [&>pre]:break-words [&>pre]:h-full [&>pre]:w-full [&>pre]:p-4 [&>pre]:!bg-background [&>pre]:min-h-full [&_pre]:!bg-background [&_code]:!bg-background"
                />
              </CodeBlock>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Select a file to view its content
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface TreeNodeProps {
  node: TreeNode;
  selectedFile: string | null;
  onFileSelect: (filePath: string) => void;
  level?: number;
}

function TreeNode({
  node,
  selectedFile,
  onFileSelect,
  level = 0,
}: TreeNodeProps) {
  if (node.type === "file") {
    return (
      <div className="relative">
        {/* Vertical lines for hierarchy */}
        {Array.from({ length: level }, (_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px bg-gray-500"
            style={{ left: `${8 + i * 16 + 8}px` }}
          />
        ))}
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start h-8 px-2 font-normal relative ${
            selectedFile === node.filePath
              ? "bg-accent text-accent-foreground"
              : ""
          }`}
          onClick={() => node.filePath && onFileSelect(node.filePath)}
          style={{ paddingLeft: `${8 + level * 16}px` }}
        >
          <File className="h-4 w-4 mr-2" />
          {node.name}
        </Button>
      </div>
    );
  }

  // Default open for common folders and shallow levels
  const defaultOpen =
    ["src", "app", "components", "lib", "pages"].includes(node.name) ||
    level < 2;

  return (
    <div className="relative">
      {/* Vertical lines for hierarchy */}
      {Array.from({ length: level }, (_, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0 w-px bg-gray-500"
          style={{ left: `${8 + i * 16 + 8}px` }}
        />
      ))}
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen={defaultOpen}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8 px-2 font-normal relative"
            style={{ paddingLeft: `${8 + level * 16}px` }}
          >
            <ChevronRight className="h-4 w-4 mr-1 transition-transform" />
            <Folder className="h-4 w-4 mr-2" />
            {node.name}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div>
            {node.children?.map((childNode, index) => (
              <TreeNode
                key={index}
                node={childNode}
                selectedFile={selectedFile}
                onFileSelect={onFileSelect}
                level={level + 1}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
