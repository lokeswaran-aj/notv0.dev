import { getSandbox } from "@/utils/e2b";
import { createClient } from "@/utils/supabase/server";
import { anthropic } from "@ai-sdk/anthropic";
import { streamObject, tool, UIMessage, UIMessageStreamWriter } from "ai";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";

export const codeGenerator = ({
  dataStream,
  chatId,
}: {
  dataStream: UIMessageStreamWriter<UIMessage>;
  chatId: string;
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

      const { partialObjectStream } = streamObject({
        model: anthropic("claude-sonnet-4-20250514"),
        maxOutputTokens: 20000,
        schemaName: "code",
        schemaDescription: "The code to be written to the file",
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
        system: `
        You are a software engineer that can build moder Next.js web applications.
        You will be given a prompt and you will need to generate the code to be written to the app/page.tsx file of a next.js project with Shadcn UI and Tailwind CSS setup that is running on a sandbox. You can import the Shadcn components from @/components/ui/ folder. You can use framer motion for animations.
        `,
        prompt,
        onError: (error) => {
          console.error(error);
        },
        onFinish: async ({ object, usage }) => {
          console.log("codeGenerator usage:");
          console.dir(usage, { depth: null });
          if (!object) {
            console.error("No code was generated");
            return;
          }
          const { filePath, code } = object;
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
        },
      });

      for await (const element of partialObjectStream) {
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
