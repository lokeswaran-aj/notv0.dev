"use client";

import { AppPreview } from "@/components/chat/app-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useArtifact } from "@/stores/use-artifact";
import { useDataStream } from "@/stores/use-data-stream";
import { useTitle } from "@/stores/use-title";
import { CodeData } from "@/types/data/code";
import { Json } from "@/types/database.types";
import { CodeXml, EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ArtifactActions } from "./artifact/artifact-actions";
import { ArtifactTitle } from "./artifact/artifact-header";
import { CodeView } from "./code-view";

type CodePreviewTabsProps = {
  sandBoxUrl?: string | null;
  code?: Json | null;
  title?: string | null;
};

export const CodePreviewTabs = (props: CodePreviewTabsProps) => {
  const { sandBoxUrl, code, title } = props;
  const [activeTab, setActiveTab] = useState("code");
  const { dataStream, setDataStream } = useDataStream();
  const setFiles = useArtifact((state) => state.setFiles);
  const setTitle = useTitle((state) => state.setTitle);

  useEffect(() => {
    if (title) {
      setTitle(title);
    }

    if (code) {
      setFiles((code as CodeData).files);
    }

    if (sandBoxUrl) {
      setDataStream({
        type: "data-sandboxHost",
        data: { host: sandBoxUrl },
      });
    }
  }, []);

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
        <div className="flex items-center gap-2 p-2 justify-between">
          <TabsList className="p-0 bg-background border border-secondary rounded-lg">
            <TabsTrigger value="code">
              <CodeXml className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="preview">
              <EyeIcon className="w-3 h-3" />
            </TabsTrigger>
          </TabsList>
          <ArtifactTitle />
          <ArtifactActions
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
