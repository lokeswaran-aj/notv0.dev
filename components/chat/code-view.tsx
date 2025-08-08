"use client";

import { useDataStream } from "@/stores/use-data-stream";

export const CodeView = () => {
  const { dataStream } = useDataStream();
  console.log("🚀 ~ CodeView ~ dataStream:", dataStream);

  return (
    <div className="relative flex h-full flex-col border border-secondary rounded-lg p-4">
      {dataStream.filter((p) => p.type === "data-code").length === 0 ? (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-sm text-muted-foreground">No code available</p>
        </div>
      ) : (
        dataStream
          .filter((part) => part.type === "data-code")
          .map((part) => (
            <div key={`${part.id}-${part.type}`}>
              <pre>{part.data.code}</pre>
            </div>
          ))
      )}
    </div>
  );
};
