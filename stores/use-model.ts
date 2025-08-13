import { AI_MODELS } from "@/lib/models";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ModelStore = {
  model: string;
  setModel: (model: string) => void;
};

export const useModel = create<ModelStore>()(
  persist(
    (set) => ({
      model: AI_MODELS[0].id,
      setModel: (model) => set({ model }),
    }),
    {
      name: "model",
    }
  )
);
