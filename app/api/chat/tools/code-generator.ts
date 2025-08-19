import { manageSandbox } from "@/utils/e2b";
import { getArtifactByChatId, updateArtifact } from "@/utils/supabase/actions";
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
import { codeGenerationOutputSchema } from "../schema";

export const codeGenerator = ({
  dataStream,
  chatId,
  model,
}: {
  dataStream: UIMessageStreamWriter<UIMessage>;
  chatId: string;
  model: LanguageModel;
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

      const { partialObjectStream, object } = streamObject({
        model,
        maxOutputTokens: 20000,
        schemaName: "code",
        schemaDescription: "The code to be written to the file",
        schema: codeGenerationOutputSchema,
        system: codeGenerationSystemPrompt,
        prompt,
        experimental_telemetry: {
          isEnabled: true,
          metadata: {
            ls_run_name: "code-generator-tool",
            chatId,
            environment: process.env.NODE_ENV,
          },
        },

        onError: (error) => {
          console.error(error);
        },

        onFinish: async ({ object }) => {
          if (!object) {
            console.error("No code was generated");
            return;
          }

          const artifacts = await getArtifactByChatId(chatId);

          const sandboxId = artifacts?.sandbox_id;
          if (!sandboxId) {
            console.error("No sandbox id found");
            return;
          }

          const sandbox = await manageSandbox(chatId, sandboxId);
          await Promise.all(
            object.files.map(({ filePath, code }) => {
              sandbox.files.write(filePath, code);
            })
          );

          const host = `https://${sandbox.getHost(3000)}`;

          await Promise.all([
            fetch(host),
            updateArtifact(chatId, {
              sandbox_id: sandboxId,
              sandbox_url: host,
              code: object,
            }),
          ]);

          dataStream.write({
            type: "data-sandboxHost",
            data: {
              host,
            },
            transient: true,
            id: "data-sandboxHost",
          });
        },
      });

      dataStream.write({
        type: "data-codeGenerationStarted",
        data: {
          started: true,
        },
        transient: true,
      });
      for await (const partialObject of partialObjectStream) {
        dataStream.write({
          type: "data-code",
          id: "data-code",
          data: {
            files: partialObject.files,
          },
          transient: true,
        });
      }

      return {
        summary: (await object).summary,
      };
    },
  });
};
