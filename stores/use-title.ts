import { TitleData } from "@/types/data/title";
import { create } from "zustand";

export const useTitle = create<TitleData>((set) => ({
  title: "New Chat",
  setTitle: (title) => set({ title }),
  resetTitle: () => set({ title: "New Chat" }),
}));
