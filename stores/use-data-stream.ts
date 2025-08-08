import { CustomUIDataTypes } from "@/types/message";
import type { DataUIPart } from "ai";
import { create } from "zustand";

type DataStreamStore = {
  dataStream: DataUIPart<CustomUIDataTypes>[];
  setDataStream: (dataStream: DataUIPart<CustomUIDataTypes>) => void;
  clearDataStream: () => void;
};

export const useDataStream = create<DataStreamStore>((set) => ({
  dataStream: [],
  setDataStream: (dataStream) => {
    return set((state) => ({
      dataStream: [...state.dataStream, dataStream],
    }));
  },
  clearDataStream: () => {
    return set({ dataStream: [] });
  },
}));
