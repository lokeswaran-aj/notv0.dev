import { Code } from "@/types/message";
import { create } from "zustand";

export const useFiles = create<{
  files: Code[];
  setFiles: (files: Code[]) => void;
  clearFiles: () => void;
}>((set) => ({
  files: [],
  setFiles: (newFiles) => set({ files: newFiles }),
  clearFiles: () => set({ files: [] }),
}));
