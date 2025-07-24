import { ChatInput } from "../chat-input/chat-input";

type Props = {};

export const Hero = (props: Props) => {
  return (
    <main className="flex flex-col items-center gap-8 pt-80 h-dvh w-full overflow-hidden">
      <h1 className="text-4xl font-bold">What can I help you build?</h1>
      <ChatInput />
    </main>
  );
};
