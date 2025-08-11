"use client";

import { AppPreview } from "@/components/chat/app-preview";
import { CodeView } from "@/components/chat/code-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataStream } from "@/stores/use-data-stream";
import { CodeXml, EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ArtifaceActions } from "./artifact-actions";
import { ArtifactTitle } from "./artifact-header";

type CodePreviewTabsProps = {
  sandBoxUrl?: string | null;
  code?: { filePath: string; code: string }[] | null;
  title?: string | null;
};

export const CodePreviewTabs = (props: CodePreviewTabsProps) => {
  const { sandBoxUrl, code, title } = props;
  const [activeTab, setActiveTab] = useState("code");
  const { dataStream, setDataStream } = useDataStream();

  useEffect(() => {
    const init = async () => {
      if (title) {
        setDataStream({
          type: "data-title",
          data: { title },
        });
      }
      if (sandBoxUrl && code) {
        setDataStream({
          type: "data-sandboxHost",
          data: { host: sandBoxUrl },
        });
        code.forEach((file) => {
          setDataStream({
            type: "data-code",
            data: file as unknown as { filePath: string; code: string }[],
          });
        });
      }
    };
    init();
  }, [sandBoxUrl, code, title]);

  useEffect(() => {
    if (dataStream.sandboxHost?.host) {
      setActiveTab("preview");
    } else {
      setActiveTab("code");
    }
  }, [dataStream]);

  return (
    <div className="relative flex h-full min-h-0 flex-col border border-secondary rounded-lg">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex h-full w-full min-h-0 flex-col gap-0"
      >
        <div className="flex items-center gap-2 justify-between">
          <TabsList className="m-2 p-0 bg-background border border-secondary rounded-lg">
            <TabsTrigger value="code">
              <CodeXml className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="preview">
              <EyeIcon className="w-3 h-3" />
            </TabsTrigger>
          </TabsList>
          <ArtifactTitle />
          <ArtifaceActions
            activeTab={activeTab}
            hostUrl={dataStream.sandboxHost?.host}
          />
        </div>
        <TabsContent value="preview" className="flex-1 min-h-0 overflow-hidden">
          <AppPreview />
        </TabsContent>
        <TabsContent value="code" className="flex-1 min-h-0 overflow-hidden">
          <CodeView />
        </TabsContent>
      </Tabs>
    </div>
  );
};
