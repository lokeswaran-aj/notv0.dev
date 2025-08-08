import { CustomUIDataTypes } from "@/types/message";
import type { DataUIPart } from "ai";
import { create } from "zustand";

type DataStreamStore = {
  dataStream: Partial<CustomUIDataTypes>;
  setDataStream: (dataPart: DataUIPart<CustomUIDataTypes>) => void;
  clearDataStream: () => void;
};

export const useDataStream = create<DataStreamStore>((set) => ({
  dataStream: {},
  setDataStream: (dataPart) =>
    set((state) => {
      const typeKey = (
        dataPart.type.startsWith("data-")
          ? dataPart.type.slice(5)
          : dataPart.type
      ) as keyof CustomUIDataTypes;

      const next: Partial<CustomUIDataTypes> = {
        ...state.dataStream,
        [typeKey]: {
          ...(state.dataStream[typeKey] as object | undefined),
          ...(dataPart.data as object),
        } as any,
      };

      return { dataStream: next };
    }),
  clearDataStream: () => set({ dataStream: {} }),
}));
