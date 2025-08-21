import { manageSandbox } from "@/utils/e2b";
import { getArtifactByChatId, updateArtifact } from "@/utils/supabase/actions";
import {
  LanguageModel,
  streamObject,
  tool,
  UIMessage,
  UIMessageStreamWriter,
} from "ai";
import { z } from "zod";
import { codeGenerationOutputSchema } from "../schema";
import generateFilesDescription from "./generate-files-description.md";
import generateFilesPrompt from "./generate-files-prompt.md";

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
    name: "generate-files",
    description: generateFilesDescription,
    inputSchema: z.object({ prompt: z.string() }),
    execute: async ({ prompt }, { messages, toolCallId }) => {
      dataStream.write({
        id: toolCallId,
        type: "data-id",
        data: {
          toolCallId,
        },
        transient: true,
      });

      const { partialObjectStream, object } = streamObject({
        model,
        maxOutputTokens: 20000,
        schemaName: "code",
        schemaDescription: "The code to be written to the file",
        schema: codeGenerationOutputSchema,
        system: generateFilesPrompt,
        messages: [...messages, { role: "user", content: prompt }],
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
            id: toolCallId,
            type: "data-sandboxHost",
            data: {
              host,
            },
            transient: true,
          });
        },
      });

      dataStream.write({
        id: toolCallId,
        type: "data-codeGenerationStarted",
        data: {
          started: true,
        },
        transient: true,
      });
      for await (const partialObject of partialObjectStream) {
        if (
          partialObject.files &&
          Array.isArray(partialObject.files) &&
          partialObject.files.length > 0
        ) {
          dataStream.write({
            type: "data-code",
            id: toolCallId,
            data: {
              files: partialObject.files,
            },
            transient: true,
          });
        }
      }
      const output = await object;
      return `Successfully generated and uploaded ${
        output.files.length
      } files. Their file paths and codes are as follows:
        ${output.files
          .map((file) => `FilePath: ${file.filePath}\nCode: ${file.code}\n`)
          .join("\n")}`;
    },
  });
};
