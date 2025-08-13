export type CustomUIDataTypes = {
  sandboxHost: {
    host: string;
  };
  id: {
    id: string;
  };
  title: {
    title: string;
  };
  codeGenerationStarted: {
    started: boolean;
  };
};

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
