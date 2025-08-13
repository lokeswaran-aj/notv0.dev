import { create } from "zustand";
import { persist } from "zustand/middleware";

type InitialMessageStore = {
  initialMessage: string;
  setInitialMessage: (message: string) => void;
  clearInitialMessage: () => void;
};

export const useInitialMessage = create<InitialMessageStore>()(
  persist(
    (set) => ({
      initialMessage: "",
      setInitialMessage: (message: string) => set({ initialMessage: message }),
      clearInitialMessage: () => set({ initialMessage: "" }),
    }),
    {
      name: "initial-message",
    }
  )
);
