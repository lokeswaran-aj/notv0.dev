import { CodeBlock, CodeBlockCode } from "@/components/ui/code-block";
import { useDataStream } from "@/stores/use-data-stream";
import { useFiles } from "@/stores/use-files";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

export const CodeEditor = () => {
  const code = useFiles((state) => state.code);
  const selectedFilePath = useFiles((state) => state.selectedFilePath);
  const memoizedCode = useMemo(() => code, [code]);
  const codeGenerationStarted = useDataStream(
    (state) => state.dataStream.codeGenerationStarted
  );

  return (
    <div className="h-full w-full flex items-center justify-center bg-background border-l border-secondary rounded-b-lg overflow-hidden">
      <div className="h-full w-full bg-background">
        {selectedFilePath && memoizedCode ? (
          <CodeBlock className="h-full w-full overflow-hidden border-0 rounded-none bg-background">
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
            <p className="text-sm text-muted-foreground">
              Code generation started
            </p>
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
