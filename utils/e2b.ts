import constants from "@/lib/constants";
import { Sandbox } from "@e2b/code-interpreter";

export const createSandbox = async (chatId: string) => {
  const sbx = await Sandbox.create("open-v0-nextjs", {
    timeoutMs: constants.SANDBOX_TIMEOUT,
    metadata: { chatId },
  });
  return sbx.sandboxId;
};

export const getSandbox = async (sandboxId: string) => {
  const sbx = await Sandbox.connect(sandboxId);
  sbx.setTimeout(constants.SANDBOX_TIMEOUT);
  return sbx;
};
