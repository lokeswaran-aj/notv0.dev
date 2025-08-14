"use client";

import { useArtifact } from "@/stores/use-artifact";

export const AppPreview = () => {
  const hostUrl = useArtifact((state) => state.sandBoxUrl);

  return (
    <div className="relative flex h-full flex-col border-0 border-t border-secondary rounded-b-lg overflow-hidden">
      {hostUrl ? (
        <iframe
          src={hostUrl}
          className="h-full w-full"
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
