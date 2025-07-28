import { Sandbox } from "@e2b/code-interpreter";

export const getE2bSandbox = async () => {
  const sbx = await Sandbox.create("open-v0-nextjs");
  const sandboxId = sbx.sandboxId;
  const sandbox = await Sandbox.connect(sandboxId);
  return sandbox;
};
