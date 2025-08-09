export type CustomUIDataTypes = {
  sandboxHost: {
    host: string;
  };
  code: {
    filePath: string;
    code: string;
  }[];
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
