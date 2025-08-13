import { ChatView } from "@/components/chat/chat-view";
import { CodePreviewTabs } from "@/components/chat/code-preview-tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { convertToUIMessages } from "@/lib/utils";
import { Tables } from "@/types/database.types";
import { CodeData } from "@/types/message";
import { createSandbox, getSandbox } from "@/utils/e2b";
import {
  getArtifactByChatId,
  getChatById,
  getMessagesByChatId,
} from "@/utils/supabase/actions";
import { createClient } from "@/utils/supabase/server";
import { Sandbox } from "@e2b/code-interpreter";
import { UIMessage } from "ai";

const ChatPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const chat = await getChatById(id);

  let uiMessages: UIMessage[] = [];
  let artifact: Tables<"artifacts"> | null = null;

  if (chat) {
    const initialMessages = await getMessagesByChatId(id);
    uiMessages = initialMessages ? convertToUIMessages(initialMessages) : [];
    if (uiMessages.length !== 0) {
      const oldArtifact = await getArtifactByChatId(id);
      if (oldArtifact?.sandbox_id) {
        const sandboxList = await Sandbox.list({
          query: {
            metadata: { chatId: id },
            state: ["running"],
          } as {
            metadata?: Record<string, string>;
            state?: Array<"running" | "paused">;
          },
        });
        if (Array.isArray(sandboxList) && sandboxList.length > 0) {
          artifact = oldArtifact;
        } else {
          if (oldArtifact?.code) {
            const sandboxId = await createSandbox(id);
            const sandbox = await getSandbox(sandboxId);

            const existingFiles = (oldArtifact.code as CodeData).files;
            for (const file of existingFiles) {
              if (file.filePath && file.code) {
                await sandbox.files.write(file.filePath, file.code);
              }
            }

            const host = `https://${sandbox.getHost(3000)}`;
            const supabase = await createClient();
            const { data } = await supabase
              .from("artifacts")
              .update({
                sandbox_id: sandboxId,
                sandbox_url: host,
              })
              .eq("chat_id", id)
              .select()
              .single();
            artifact = data;
          }
        }
      }
    }
  }

  return (
    <main className="flex flex-col items-center gap-8 p-4 pt-0 h-[calc(100dvh-3.5rem)] w-full overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="min-h-0">
        <ResizablePanel
          defaultSize={30}
          className="min-w-80"
          maxSize={50}
          minSize={20}
        >
          <ChatView initialMessages={uiMessages} chatId={id} />
        </ResizablePanel>
        <ResizableHandle
          withHandle
          className="border rounded w-1 mx-1 opacity-0 bg-secondary hover:opacity-100"
        />
        <ResizablePanel defaultSize={70} className="min-w-sm min-h-0">
          <CodePreviewTabs
            sandBoxUrl={artifact?.sandbox_url}
            code={artifact?.code}
            title={chat?.title}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
};

export default ChatPage;
