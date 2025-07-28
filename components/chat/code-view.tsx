"use client";

import { useDataStream } from "@/stores/use-data-stream";

export const CodeView = () => {
  const { dataStream } = useDataStream();

  return (
    <div className="relative flex h-full flex-col border border-secondary rounded-lg p-4">
      {dataStream.length === 0 && (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-sm text-muted-foreground">No preview available</p>
        </div>
      )}

      {dataStream.map((part) => {
        if (part.type === "data-sandboxHost") {
          return (
            <iframe
              src={part.data.host}
              className="h-full w-full rounded-lg border border-secondary"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              allow="clipboard-read; clipboard-write"
              referrerPolicy="no-referrer-when-downgrade"
              key={`${part.id}-${part.type}`}
            />
          );
        } else if (part.type === "data-code") {
          return (
            <div key={`${part.id}-${part.type}`}>
              <pre>{part.data.code}</pre>
            </div>
          );
        } else if (part.type === "data-id") {
          return (
            <div
              key={`${part.id}-${part.type}`}
              className="flex h-full w-full items-center justify-center text-base"
            >
              I am generating the code, please wait...
            </div>
          );
        }
      })}
    </div>
  );
};
