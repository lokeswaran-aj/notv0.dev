import { CodeBlock, CodeBlockCode } from "@/components/ui/code-block";
import { useFiles } from "@/stores/use-files";
import { useMemo } from "react";

export const CodeEditor = () => {
  const code = useFiles((state) => state.code);
  const selectedFilePath = useFiles((state) => state.selectedFilePath);
  const memoizedCode = useMemo(() => code, [code]);
  return (
    <div className="h-full w-full flex items-center justify-center bg-muted/10 border-l border-secondary">
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
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No code selected</p>
          </div>
        )}
      </div>
    </div>
  );
};
