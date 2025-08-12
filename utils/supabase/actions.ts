import { Json } from "@/types/database.types";
import { UIMessage } from "ai";
import { v7 as uuidv7 } from "uuid";
import { createSandbox } from "../e2b";
import { createClient } from "./server";

const getChatById = async (id: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("chats")
    .select("*")
    .eq("id", id)
    .single();
  return data;
};

const createChat = async (chatId: string, userId: string, title: string) => {
  const supabase = await createClient();

  await supabase.from("chats").insert({
    id: chatId,
    title,
    user_id: userId,
  });
};

const getMessagesByChatId = async (chatId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });
  return data;
};

const createMessage = async (chatId: string, message: UIMessage) => {
  const supabase = await createClient();
  await supabase.from("messages").insert({
    chat_id: chatId,
    parts: message.parts as Json,
    role: message.role,
    id: uuidv7(),
  });
};

const deleteMessagesAfter = async (chatId: string, messageId: string) => {
  const supabase = await createClient();

  const { data: targetMessage } = await supabase
    .from("messages")
    .select("created_at")
    .eq("chat_id", chatId)
    .eq("id", messageId)
    .single();

  if (!targetMessage) {
    console.error(`Target message ${messageId} not found`);
    throw new Error(`Invalid message ID`);
  }

  await supabase
    .from("messages")
    .delete()
    .eq("chat_id", chatId)
    .gt("created_at", targetMessage.created_at);
};

const createArtifact = async (chatId: string) => {
  const supabase = await createClient();
  const sandboxId = await createSandbox(chatId);
  await supabase.from("artifacts").insert({
    chat_id: chatId,
    id: uuidv7(),
    sandbox_id: sandboxId,
  });
};

const getArtifactByChatId = async (chatId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("artifacts")
    .select("*")
    .eq("chat_id", chatId)
    .single();
  return data;
};

export {
  createArtifact,
  createChat,
  createMessage,
  deleteMessagesAfter,
  getArtifactByChatId,
  getChatById,
  getMessagesByChatId,
};
