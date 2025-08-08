"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useDataStream } from "@/stores/use-data-stream";

export const CodeView = () => {
  const { dataStream } = useDataStream();
  const code = dataStream.code?.code;

  return (
    <div className="relative flex h-full flex-col border border-secondary rounded-lg p-4 overflow-hidden">
      {!code ? (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-sm text-muted-foreground">No code available</p>
        </div>
      ) : (
        <ScrollArea className="h-full w-full">
          <div className="w-full h-full">
            <pre className="w-full overflow-x-auto text-[13px] px-4 py-4 whitespace-pre-wrap">
              {code}
            </pre>
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
