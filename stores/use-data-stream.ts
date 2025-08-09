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

      // Special handling for code array - accumulate individual file objects
      if (typeKey === "code") {
        const existingCode = state.dataStream.code || [];
        const newCodeItem = dataPart.data as unknown as {
          filePath: string;
          code: string;
        };

        // Check if this file already exists and update it, otherwise add it
        const existingIndex = existingCode.findIndex(
          (item) => item.filePath === newCodeItem.filePath
        );

        let updatedCode;
        if (existingIndex >= 0) {
          // Update existing file
          updatedCode = [...existingCode];
          updatedCode[existingIndex] = newCodeItem;
        } else {
          // Add new file
          updatedCode = [...existingCode, newCodeItem];
        }

        const next: Partial<CustomUIDataTypes> = {
          ...state.dataStream,
          code: updatedCode,
        };

        return { dataStream: next };
      }

      // Default handling for other data types
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
