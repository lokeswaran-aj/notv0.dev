import { CodeBlock, CodeBlockCode } from "@/components/ui/code-block";
import { useArtifact } from "@/stores/use-artifact";
import { useDataStream } from "@/stores/use-data-stream";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

export const CodeEditor = () => {
  const code = useArtifact((state) => state.code);
  const selectedFilePath = useArtifact((state) => state.selectedFilePath);
  const codeGenerationStarted = useDataStream(
    (state) => state.dataStream.codeGenerationStarted
  );
  const memoizedCode = useMemo(() => code, [code]);
  const codeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (codeGenerationStarted && codeContainerRef.current) {
      const scrollTimeout = setTimeout(() => {
        const scrollableElement = codeContainerRef.current?.querySelector(
          'div[class*="overflow-auto"]'
        );

        if (scrollableElement) {
          scrollableElement.scrollTo({
            top: scrollableElement.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 50);

      return () => clearTimeout(scrollTimeout);
    }
  }, [code, codeGenerationStarted]);

  return (
    <div className="h-full w-full flex items-center justify-center bg-background border-l border-secondary rounded-b-lg overflow-hidden">
      <div className="h-full w-full bg-background">
        {selectedFilePath && memoizedCode ? (
          <CodeBlock
            ref={codeContainerRef}
            className="h-full w-full overflow-hidden border-0 rounded-none bg-background"
          >
            <CodeBlockCode
              theme="github-dark-default"
              code={memoizedCode}
              language="tsx"
              className="h-full w-full overflow-auto bg-background [&>pre]:whitespace-pre-wrap [&>pre]:break-words [&>pre]:h-full [&>pre]:w-full [&>pre]:p-4 [&>pre]:!bg-background [&>pre]:min-h-full [&_pre]:!bg-background [&_code]:!bg-background"
            />
          </CodeBlock>
        ) : codeGenerationStarted ? (
          <div className="h-full w-full flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <p className="text-sm text-muted-foreground">Generating code...</p>
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No code selected</p>
          </div>
        )}
      </div>
    </div>
  );
};
