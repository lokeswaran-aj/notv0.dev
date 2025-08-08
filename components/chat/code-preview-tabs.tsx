"use client";

import { AppPreview } from "@/components/chat/app-preview";
import { CodeView } from "@/components/chat/code-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, EyeIcon } from "lucide-react";

export const CodePreviewTabs = () => {
  return (
    <div className="flex h-full w-full flex-col">
      <Tabs defaultValue="preview" className="flex h-full w-full flex-col">
        <TabsList>
          <TabsTrigger value="code">
            <CodeIcon className="w-4 h-4" />
          </TabsTrigger>
          <TabsTrigger value="preview">
            <EyeIcon className="w-4 h-4" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="flex-1">
          <AppPreview />
        </TabsContent>
        <TabsContent value="code" className="flex-1">
          <CodeView />
        </TabsContent>
      </Tabs>
    </div>
  );
};
