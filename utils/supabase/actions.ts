import { Json } from "@/types/database.types";
import { UIMessage } from "ai";
import { v7 as uuidv7 } from "uuid";
import { getE2bSandboxId } from "../e2b";
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

const createArtifact = async (chatId: string) => {
  const supabase = await createClient();
  const sandboxId = await getE2bSandboxId();
  await supabase.from("artifacts").insert({
    chat_id: chatId,
    id: uuidv7(),
    sandbox_id: sandboxId,
  });
};

export {
  createArtifact,
  createChat,
  createMessage,
  getChatById,
  getMessagesByChatId,
};
