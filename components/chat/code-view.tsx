import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FileTree } from "./artifact/file-tree";

export const CodeView = () => {
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
          <div className="h-full w-full flex items-center justify-center bg-muted/10 border-l border-secondary">
            <p className="text-muted-foreground text-sm">
              Code content will be displayed here
            </p>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
