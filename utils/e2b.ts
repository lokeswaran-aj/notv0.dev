import constants from "@/lib/constants";
import { Sandbox } from "@e2b/code-interpreter";

export const createSandbox = async (chatId: string) => {
  const sbx = await Sandbox.create("open-v0-nextjs", {
    timeoutMs: constants.SANDBOX_TIMEOUT,
    metadata: { chatId },
  });
  return sbx.sandboxId;
};

export const manageSandbox = async (chatId: string, sandboxId: string) => {
  const sandboxList = await Sandbox.list({
    query: {
      metadata: { chatId },
      state: ["running"],
    } as {
      metadata?: Record<string, string>;
      state?: Array<"running" | "paused">;
    },
  });

  const oldSandboxId = sandboxList.find(
    (sbx) => sbx.sandboxId === sandboxId
  )?.sandboxId;
  if (oldSandboxId) {
    const oldSandbox = await Sandbox.connect(oldSandboxId);
    oldSandbox.setTimeout(constants.SANDBOX_TIMEOUT);
    return oldSandbox;
  }

  const newSandboxId = await createSandbox(chatId);
  const sandbox = await Sandbox.connect(newSandboxId);
  sandbox.setTimeout(constants.SANDBOX_TIMEOUT);

  return sandbox;
};
