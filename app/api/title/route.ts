import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { chatTitleSchema } from "./schema";

export const POST = async (req: NextRequest) => {
  const prompt = await req.json();

  const { object } = await generateObject({
    model: anthropic("claude-3-7-sonnet-20250219"),
    schema: chatTitleSchema,
    system: "Generate a based on the user's prompt.",
    prompt,
  });

  return NextResponse.json(object);
};
