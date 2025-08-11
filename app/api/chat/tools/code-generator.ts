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

      const { elementStream } = streamObject({
        model: anthropic("claude-sonnet-4-20250514"),
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
        system: `You are an expert full-stack engineer specializing in building modern Next.js applications with TypeScript, Tailwind CSS, and Shadcn UI. Your task is to generate high-quality, production-ready code for a Next.js 15 app running in a sandbox environment. The core page to be updated is app/page.tsx, but you may also create or modify additional files for proper code organization and maintainability.
Project Setup & Constraints:
Framework: Next.js (App Router, TypeScript)
Styling: Tailwind CSS (utility-first, responsive)
UI Components: Shadcn UI (@/components/ui/…) — import only from this folder. Do not generate any shadcn components.
Animations: Framer Motion (smooth, performant transitions and micro-interactions).
Code Quality: Use clean, idiomatic React patterns; ensure accessibility (ARIA roles, semantic HTML).
File Structure: Keep components modular; reusable UI in components/ folder, page logic in app/page.tsx or relevant route folders.
Imports: Use absolute imports with @/ alias.
What You Must Deliver:
Working Implementation
Fully functional UI based on the given user prompt.
No placeholder text unless explicitly instructed.
Use real, meaningful component structures instead of dumping all code into one file.
Styling & Theming:
Follow Tailwind best practices; You make sure to use the correct tailwind classes.
Use Shadcn UI variants & props for consistent design language from the @/components/ui/ folder.
Animation Guidelines:
Apply Framer Motion for page transitions, fade-ins, staggered lists, or hover effects as appropriate.
Keep animations subtle and performant.
Code Organization:
Break down into reusable components where logical.
Maintain clear separation between UI and data logic.
Name files and components descriptively.`,
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
