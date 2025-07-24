import { UIMessage } from "ai";
import { create } from "zustand";

interface MessageStore {
  messages: UIMessage[];
  addMessage: (message: UIMessage) => void;
  setMessages: (messages: UIMessage[]) => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
}));
