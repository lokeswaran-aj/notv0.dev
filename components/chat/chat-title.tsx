"use client";

import { useChatTitleStore } from "@/stores/chat";
import { usePathname } from "next/navigation";

export const ChatTitle = () => {
  const pathname = usePathname();
  const title = useChatTitleStore((state) => state.title);

  if (pathname.startsWith("/c/")) {
    return (
      <div className="flex items-center gap-2">
        <p className="text-base font-medium text-foreground">{title}</p>
      </div>
    );
  }

  return null;
};
