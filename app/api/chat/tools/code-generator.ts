import { SharedV2ProviderOptions } from "@/lib/models";
import { getSandbox } from "@/utils/e2b";
import { createClient } from "@/utils/supabase/server";
import {
  LanguageModel,
  streamObject,
  tool,
  UIMessage,
  UIMessageStreamWriter,
} from "ai";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { codeGenerationSystemPrompt } from "../prompt";

export const codeGenerator = ({
  dataStream,
  chatId,
  model,
  providerOptions,
}: {
  dataStream: UIMessageStreamWriter<UIMessage>;
  chatId: string;
  model: LanguageModel;
  providerOptions: SharedV2ProviderOptions | undefined;
}) => {
  return tool({
    description:
      "A Software Engineer that can build modern Next.js web applications",
    inputSchema: z.object({ prompt: z.string() }),
    execute: async ({ prompt }) => {
      const id = uuidv7();
      dataStream.write({
        type: "data-id",
        data: {
          id,
        },
        transient: true,
      });

      const { elementStream } = streamObject({
        model,
        providerOptions,
        maxOutputTokens: 20000,
        schemaName: "code",
        schemaDescription: "The code to be written to the file",
        output: "array",
        schema: z.object({
          filePath: z
            .string()
            .describe("The relative path to the file to be created"),
          code: z
            .string()
            .describe(
              "The code to be written to the file. Do not wrap with backticks"
            ),
        }),
        system: codeGenerationSystemPrompt,
        prompt,
        onError: (error) => {
          console.error(error);
        },
        onFinish: async ({ object, usage, warnings, error }) => {
          console.log("codeGenerator usage:");
          console.dir(usage, { depth: null });
          console.log("codeGenerator error:");
          console.dir(error, { depth: null });
          console.log("codeGenerator warnings:");
          console.dir(warnings, { depth: null });
          if (!object) {
            console.error("No code was generated");
            return;
          }
          for (const element of object) {
            const { filePath, code } = element;
            const supabase = await createClient();
            const { data: artifacts } = await supabase
              .from("artifacts")
              .select()
              .eq("chat_id", chatId)
              .single();
            const sandboxId = artifacts?.sandbox_id;
            if (!sandboxId) {
              console.error("No sandbox id found");
              return;
            }
            const sandbox = await getSandbox(sandboxId);
            sandbox.setTimeout(60_000 * 5);
            await sandbox.files.write(filePath, code);

            const host = `https://${sandbox.getHost(3000)}`;

            await supabase
              .from("artifacts")
              .update({
                code: object,
                sandbox_url: host,
              })
              .eq("chat_id", chatId);

            dataStream.write({
              type: "data-sandboxHost",
              data: {
                host,
              },
              transient: true,
              id: "data-sandboxHost",
            });
          }
        },
      });

      dataStream.write({
        type: "data-codeGenerationStarted",
        data: {
          started: true,
        },
        transient: true,
      });
      for await (const element of elementStream) {
        dataStream.write({
          type: "data-code",
          id: "data-code",
          data: {
            filePath: element.filePath,
            code: element.code,
          },
          transient: true,
        });
      }

      return {
        summary:
          "The code was generated successfully and rendered to the user in a sandbox",
      };
    },
  });
};
