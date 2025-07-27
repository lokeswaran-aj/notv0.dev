import { Tables } from "@/types/database.types";
import { UIDataTypes, UIMessage, UIMessagePart, UITools } from "ai";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToUIMessages(
  messages: Tables<"messages">[]
): UIMessage[] {
  return messages.map((message) => ({
    id: message.id,
    role: message.role as "user" | "assistant" | "system",
    parts: message.parts as Array<UIMessagePart<UIDataTypes, UITools>>,
    metadata: {
      createdAt: message.created_at,
    },
  }));
}
