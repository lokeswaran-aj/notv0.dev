"use client";

import { useDataStream } from "@/stores/use-data-stream";

export const AppPreview = () => {
  const { dataStream } = useDataStream();

  const hostUrl = dataStream.find((part) => part.type === "data-sandboxHost")
    ?.data.host;

  return (
    <div className="relative flex h-full flex-col">
      {hostUrl ? (
        <iframe
          src={hostUrl}
          className="h-full w-full border border-secondary"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          allow="clipboard-read; clipboard-write"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-sm text-muted-foreground">No preview available</p>
        </div>
      )}
    </div>
  );
};
