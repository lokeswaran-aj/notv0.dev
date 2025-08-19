import { registerOTel } from "@vercel/otel";
import { initializeOTEL } from "langsmith/experimental/otel/setup";

const { DEFAULT_LANGSMITH_SPAN_PROCESSOR } = initializeOTEL({
  skipGlobalContextManagerSetup: true,
});

export function register() {
  registerOTel({
    serviceName: `notv0-${process.env.NODE_ENV}`,
    spanProcessors: [DEFAULT_LANGSMITH_SPAN_PROCESSOR],
  });
}
