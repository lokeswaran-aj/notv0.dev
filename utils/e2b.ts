import constants from "@/lib/constants";
import { Sandbox, SandboxError } from "@e2b/code-interpreter";

export const createSandbox = async (chatId: string) => {
  const sbx = await Sandbox.create("open-v0-nextjs", {
    timeoutMs: constants.SANDBOX_TIMEOUT,
    metadata: { chatId },
  });
  return sbx.sandboxId;
};

export const getSandbox = async (chatId: string, sandboxId: string) => {
  try {
    const sbx = await Sandbox.connect(sandboxId);
    sbx.setTimeout(constants.SANDBOX_TIMEOUT);
    return sbx;
  } catch (error) {
    if (error instanceof SandboxError) {
      const sandboxId = await createSandbox(chatId);
      return await Sandbox.connect(sandboxId);
    } else {
      console.error("Error connecting to sandbox", error);
      throw error;
    }
  }
};
