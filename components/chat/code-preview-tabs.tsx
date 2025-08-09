"use client";

import { AppPreview } from "@/components/chat/app-preview";
import { CodeView } from "@/components/chat/code-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataStream } from "@/stores/use-data-stream";
import { CodeXml, EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";

type CodePreviewTabsProps = {
  sandBoxUrl?: string | null;
  code?: { filePath: string; code: string }[] | null;
};

export const CodePreviewTabs = (props: CodePreviewTabsProps) => {
  const { sandBoxUrl, code } = props;
  const [activeTab, setActiveTab] = useState("code");
  const { dataStream, setDataStream } = useDataStream();

  useEffect(() => {
    const init = async () => {
      if (sandBoxUrl && code) {
        setDataStream({
          type: "data-sandboxHost",
          data: { host: sandBoxUrl },
        });
        code.forEach((file) => {
          setDataStream({
            type: "data-code",
            data: file as any,
          });
        });
      }
    };
    init();
  }, [sandBoxUrl, code]);

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
        <TabsList className="m-2 p-0 bg-background border border-secondary rounded-lg">
          <TabsTrigger value="code">
            <CodeXml className="w-3 h-3" />
          </TabsTrigger>
          <TabsTrigger value="preview">
            <EyeIcon className="w-3 h-3" />
          </TabsTrigger>
        </TabsList>
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
