import { createClient } from "../client";

export const createChatForUser = async (chatId: string, title: string) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not found");
  }
  const { error } = await supabase.from("chats").insert({
    id: chatId,
    title,
    user_id: user.id,
  });

  if (error) {
    throw new Error(error.message);
  }
};
