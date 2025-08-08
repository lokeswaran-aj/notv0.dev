"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useDataStream } from "@/stores/use-data-stream";

export const CodeView = () => {
  const { dataStream } = useDataStream();

  return (
    <div className="relative flex h-full flex-col border border-secondary rounded-lg p-4 overflow-hidden">
      {dataStream.filter((p) => p.type === "data-code").length === 0 ? (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-sm text-muted-foreground">No code available</p>
        </div>
      ) : (
        <ScrollArea className="h-full w-full">
          <div className="w-full h-full">
            {dataStream
              .filter((part) => part.type === "data-code")
              .map((part) => (
                <div key={`${part.id}-${part.type}`} className="w-full">
                  <pre className="w-full overflow-x-auto text-[13px] px-4 py-4 whitespace-pre-wrap">
                    {part.data.code}
                  </pre>
                </div>
              ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
