import { FileTree } from "./file-tree";

export const CodeView = () => {
  return (
    <div className="relative flex h-full flex-col border border-secondary overflow-hidden">
      <div className="h-full w-full">
        <FileTree />
      </div>
    </div>
  );
};
