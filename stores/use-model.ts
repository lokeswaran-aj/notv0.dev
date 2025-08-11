import { AI_MODELS } from "@/lib/models";
import { create } from "zustand";

type ModelStore = {
  model: string;
  setModel: (model: string) => void;
};

export const useModel = create<ModelStore>((set) => ({
  model: AI_MODELS[0].id,
  setModel: (model) => set({ model }),
}));
