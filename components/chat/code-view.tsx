import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useFiles } from "@/stores/use-files";
import { useEffect } from "react";
import { CodeEditor } from "./artifact/code-editor";
import { FileTree } from "./artifact/file-tree";

export const CodeView = () => {
  const files = useFiles((state) => state.files);
  const setFilePaths = useFiles((state) => state.setFilePaths);
  const setSelectedFilePath = useFiles((state) => state.setSelectedFilePath);
  const setCode = useFiles((state) => state.setCode);
  const clearFiles = useFiles((state) => state.clearFiles);

  useEffect(() => {
    if (!files || files.length === 0) {
      clearFiles();
      return;
    }

    files.forEach(({ filePath, code }) => {
      if (filePath && code) {
        setFilePaths(filePath);
        setSelectedFilePath(filePath);
        setCode(code);
      }
    });
  }, [files, setFilePaths, setSelectedFilePath, setCode, clearFiles]);

  return (
    <div className="relative flex h-full flex-col border-0 border-t overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full min-h-0">
        <ResizablePanel
          defaultSize={30}
          minSize={20}
          maxSize={30}
          className="min-w-48"
        >
          <FileTree />
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="w-1 mx-1 opacity-0 bg-secondary hover:opacity-100"
        />

        <ResizablePanel defaultSize={70} className="min-w-sm min-h-0">
          <CodeEditor />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
