"use client";
import { ChatView } from "@/components/chat/chat-view";
import { CodeView } from "@/components/chat/code-view";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const ChatPage = () => {
  return (
    <main className="flex flex-col items-center gap-8 p-4 pt-0 h-[calc(100dvh-3.5rem)] w-full overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30} className="min-w-80">
          <ChatView />
        </ResizablePanel>
        <ResizableHandle
          withHandle
          className="border rounded w-1 mx-1 opacity-0 bg-secondary hover:opacity-100"
        />
        <ResizablePanel defaultSize={70} className="min-w-sm">
          <CodeView />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
};

export default ChatPage;
