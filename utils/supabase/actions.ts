import { Json } from "@/types/database.types";
import { UIMessage } from "ai";
import { v7 as uuidv7 } from "uuid";
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
  const { data } = await supabase
    .from("messages")
    .insert({
      chat_id: chatId,
      parts: message.parts as Json,
      role: message.role,
      id: uuidv7(),
    })
    .select()
    .single();
  return data;
};
export { createChat, createMessage, getChatById, getMessagesByChatId };
