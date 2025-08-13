import { TreeNodeType } from "@/types/message";

export const buildTreeFromFiles = (filePaths: string[]): TreeNodeType[] => {
  const root: TreeNodeType[] = [];

  filePaths.forEach((filePath) => {
    if (!filePath) return;
    const parts = filePath.split("/");
    let currentLevel = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const existingNode = currentLevel.find((node) => node.name === part);

      if (existingNode) {
        if (!isFile && existingNode.type === "folder") {
          currentLevel = existingNode.children!;
        }
      } else {
        const newNode: TreeNodeType = {
          name: part,
          type: isFile ? "file" : "folder",
          filePath: isFile ? filePath : undefined,
          children: isFile ? undefined : [],
        };

        currentLevel.push(newNode);

        if (!isFile) {
          currentLevel = newNode.children!;
        }
      }
    });
  });

  return root;
};
