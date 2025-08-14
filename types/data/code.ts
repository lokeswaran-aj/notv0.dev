export type Code = {
  filePath?: string;
  code?: string;
};

export type CodeData = {
  files: Code[];
};

export type TreeNodeType = {
  name: string;
  type: "file" | "folder";
  children?: TreeNodeType[];
  filePath?: string;
};
