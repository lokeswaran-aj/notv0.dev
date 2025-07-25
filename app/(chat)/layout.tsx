import { Header } from "@/components/header";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="pt-14">{children}</div>
    </>
  );
}
