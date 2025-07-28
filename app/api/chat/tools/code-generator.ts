import { getE2bSandbox } from "@/utils/e2b";
import { anthropic } from "@ai-sdk/anthropic";
import { generateObject, tool, UIMessage, UIMessageStreamWriter } from "ai";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";

export const codeGenerator = ({
  dataStream,
}: {
  dataStream: UIMessageStreamWriter<UIMessage>;
}) => {
  return tool({
    description:
      "A Software Engineer that can build moder Next.js web applications",
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

      const { object } = await generateObject({
        model: anthropic("claude-3-7-sonnet-20250219"),
        schema: z.object({
          filePath: z
            .string()
            .describe("The relative path to the file to be created"),
          code: z
            .string()
            .describe(
              "The code to be written to the file. Do not wrap with backticks"
            ),
          summary: z.string().describe("A summary of the code"),
        }),
        system: `
        You are a software engineer that can build moder Next.js web applications.
        You will be given a prompt and you will need to generate the code to be written to the app/page.tsx file of a next.js project with Shadcn UI and Tailwind CSS setup that is running on a sandbox. You can import the Shadcn components from @/components/ui/ folder.
        `,
        prompt,
      });

      const { filePath, code } = object;

      dataStream.write({
        type: "data-code",
        data: {
          filePath,
          code,
        },
        transient: true,
      });

      const sandbox = await getE2bSandbox();
      await sandbox.files.write(filePath, code);
      const host = `https://${sandbox.getHost(3000)}`;

      dataStream.write({
        type: "data-sandboxHost",
        data: {
          host,
        },
        transient: true,
        id: "code",
      });
      return {
        summary: object.summary,
      };
    },
  });
};
