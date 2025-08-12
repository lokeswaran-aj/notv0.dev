import { Sandbox } from "@e2b/code-interpreter";

export const createSandbox = async (chatId: string) => {
  const sbx = await Sandbox.create("open-v0-nextjs", {
    timeoutMs: 60_000 * 10,
    metadata: { chatId },
  });
  return sbx.sandboxId;
};

export const getSandbox = async (sandboxId: string) =>
  Sandbox.connect(sandboxId);
