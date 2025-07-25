import { create } from "zustand";

interface InitialMessageStore {
  initialMessage: string | null;
  setInitialMessage: (initialMessage: string | null) => void;
}

export const useInitialMessageStore = create<InitialMessageStore>((set) => ({
  initialMessage: null,
  setInitialMessage: (initialMessage) => set({ initialMessage }),
}));
