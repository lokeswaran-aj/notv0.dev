import { Code } from "@/types/data/code";
import { create } from "zustand";

const INITIAL_STATE = {
  files: [],
  selectedFilePath: null,
  filePaths: [],
  code: "",
};

export const useFiles = create<{
  files: Code[];
  selectedFilePath: string | null;
  setSelectedFilePath: (filePath: string) => void;
  setFiles: (files: Code[]) => void;
  clearFiles: () => void;
  filePaths: string[];
  setFilePaths: (filePath: string | null) => void;
  code: string;
  setCode: (code: string) => void;
}>((set) => ({
  ...INITIAL_STATE,
  clearFiles: () => set(INITIAL_STATE),

  setFiles: (newFiles) => set({ files: newFiles }),

  setSelectedFilePath: (filePath) => set({ selectedFilePath: filePath }),

  setFilePaths: (filePath) => {
    if (filePath) {
      set((state) => ({ filePaths: [...state.filePaths, filePath] }));
    } else {
      set({ filePaths: [] });
    }
  },

  setCode: (code) => set({ code }),
}));
