import { create } from "zustand";

interface ChatStore {
  title: string;
  setTitle: (title: string) => void;
}

export const useChatTitleStore = create<ChatStore>((set) => ({
  title: "",
  setTitle: (title) => set({ title }),
}));
