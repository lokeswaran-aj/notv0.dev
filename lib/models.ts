import { AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { JSONValue } from "ai";

export type SharedV2ProviderOptions = Record<string, Record<string, JSONValue>>;

export interface Model {
  id: AnthropicModelId;
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

const anthropicProviderOptions = {
  anthropic: {
    thinking: {
      type: "enabled",
      budgetTokens: 1024,
    },
  } satisfies AnthropicProviderOptions,
};

export const AI_MODELS: Model[] = [
  {
    id: "claude-sonnet-4-20250514",
    provider: "Anthropic",
    model: "claude Sonnet 4",
    providerOptions: anthropicProviderOptions,
  },
  {
    id: "claude-3-7-sonnet-20250219",
    provider: "Anthropic",
    model: "claude 3.7 Sonnet",
    providerOptions: anthropicProviderOptions,
  },
  {
    id: "claude-3-5-sonnet-latest",
    provider: "Anthropic",
    model: "claude 3.5 Sonnet",
  },
  {
    id: "claude-3-5-haiku-latest",
    provider: "Anthropic",
    model: "claude 3.5 Haiku",
  },
  {
    id: "claude-3-sonnet-20240229",
    provider: "Anthropic",
    model: "claude 3 Sonnet",
  },
  {
    id: "claude-3-haiku-20240307",
    provider: "Anthropic",
    model: "claude 3 Haiku",
  },
];
