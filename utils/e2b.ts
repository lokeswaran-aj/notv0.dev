import { Sandbox } from "@e2b/code-interpreter";

export const getE2bSandbox = async (sandboxId: string) =>
  Sandbox.connect(sandboxId);

export const getE2bSandboxId = async () => {
  const sbx = await Sandbox.create("open-v0-nextjs");
  return sbx.sandboxId;
};
