"use client";

import { useDataStream } from "@/stores/use-data-stream";
import { FileTree } from "./file-tree";

export const CodeView = () => {
  const { dataStream } = useDataStream();
  const hasCode = dataStream.code && dataStream.code.length > 0;

  return (
    <div className="relative flex h-full flex-col border border-secondary overflow-hidden">
      {!hasCode ? (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-sm text-muted-foreground">No code available</p>
        </div>
      ) : (
        <div className="h-full w-full">
          <FileTree />
        </div>
      )}
    </div>
  );
};
