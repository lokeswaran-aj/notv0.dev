export type CustomUIDataTypes = {
  sandboxHost: {
    host: string;
  };
  code: Code[];
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
  filePath: string;
  code: string;
};
