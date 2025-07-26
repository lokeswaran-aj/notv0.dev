import { create } from "zustand";

interface ChatStore {
  title: string;
  setTitle: (title: string) => void;
}

export const useChatTitleStore = create<ChatStore>((set) => ({
  title: "New Chat",
  setTitle: (title) => set({ title }),
}));
