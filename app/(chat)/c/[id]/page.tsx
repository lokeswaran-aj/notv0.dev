import { ChatView } from "@/components/chat/chat-view";
import { CodePreviewTabs } from "@/components/chat/code-preview-tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { convertToUIMessages } from "@/lib/utils";
import { getChatById, getMessagesByChatId } from "@/utils/supabase/actions";
import { UIMessage } from "ai";

const ChatPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const chat = await getChatById(id);

  let uiMessages: UIMessage[] = [];

  if (chat) {
    const initialMessages = await getMessagesByChatId(id);
    uiMessages = initialMessages ? convertToUIMessages(initialMessages) : [];
  }

  return (
    <main className="flex flex-col items-center gap-8 p-4 pt-0 h-[calc(100dvh-3.5rem)] w-full overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30} className="min-w-80" maxSize={50}>
          <ChatView initialMessages={uiMessages} chatId={id} />
        </ResizablePanel>
        <ResizableHandle
          withHandle
          className="border rounded w-1 mx-1 opacity-0 bg-secondary hover:opacity-100"
        />
        <ResizablePanel defaultSize={70} className="min-w-sm">
          <CodePreviewTabs />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
};

export default ChatPage;
