"use client";

import { AppPreview } from "@/components/chat/app-preview";
import { CodeView } from "@/components/chat/code-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataStream } from "@/stores/use-data-stream";
import { CodeXml, EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const CodePreviewTabs = () => {
  const [activeTab, setActiveTab] = useState("code");
  const { dataStream } = useDataStream();

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
