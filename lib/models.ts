import { AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { JSONValue } from "ai";

export type SharedV2ProviderOptions = Record<string, Record<string, JSONValue>>;

export interface Model {
  id: AnthropicModelId | OpenAIChatModelId;
  provider: string;
  model: string;
  providerOptions?: SharedV2ProviderOptions;
}

type AnthropicModelId =
  | "claude-sonnet-4-20250514"
  | "claude-3-7-sonnet-20250219"
  | "claude-3-5-sonnet-latest"
  | "claude-3-5-haiku-latest"
  | "claude-3-sonnet-20240229"
  | "claude-3-haiku-20240307";

type OpenAIChatModelId = "gpt-4.1" | "gpt-4.1-mini" | "gpt-4o" | "gpt-4o-mini";

const anthropicProviderOptions = {
  anthropic: {
    thinking: {
      type: "enabled",
      budgetTokens: 1024,
    },
  } satisfies AnthropicProviderOptions,
};

const openaiProviderOptions = {
  openai: {
    reasoningEffort: "low",
  },
};

export const AI_MODELS: Model[] = [
  // {
  //   id: "claude-sonnet-4-20250514",
  //   provider: "Anthropic",
  //   model: "Claude Sonnet 4",
  //   providerOptions: anthropicProviderOptions,
  // },
  // {
  //   id: "claude-3-7-sonnet-20250219",
  //   provider: "Anthropic",
  //   model: "Claude 3.7 Sonnet",
  //   providerOptions: anthropicProviderOptions,
  // },
  // {
  //   id: "claude-3-5-sonnet-latest",
  //   provider: "Anthropic",
  //   model: "Claude 3.5 Sonnet",
  //   providerOptions: anthropicProviderOptions,
  // },
  // {
  //   id: "claude-3-5-haiku-latest",
  //   provider: "Anthropic",
  //   model: "Claude 3.5 Haiku",
  //   providerOptions: anthropicProviderOptions,
  // },
  // {
  //   id: "claude-3-sonnet-20240229",
  //   provider: "Anthropic",
  //   model: "Claude 3 Sonnet",
  //   providerOptions: anthropicProviderOptions,
  // },
  // {
  //   id: "claude-3-haiku-20240307",
  //   provider: "Anthropic",
  //   model: "Claude 3 Haiku",
  //   providerOptions: anthropicProviderOptions,
  // },
  {
    id: "gpt-4.1",
    provider: "OpenAI",
    model: "GPT 4.1",
    providerOptions: openaiProviderOptions,
  },
  {
    id: "gpt-4.1-mini",
    provider: "OpenAI",
    model: "GPT 4.1 Mini",
    providerOptions: openaiProviderOptions,
  },
  {
    id: "gpt-4o",
    provider: "OpenAI",
    model: "GPT 4o",
    providerOptions: openaiProviderOptions,
  },
  {
    id: "gpt-4o-mini",
    provider: "OpenAI",
    model: "GPT 4o Mini",
    providerOptions: openaiProviderOptions,
  },
];
