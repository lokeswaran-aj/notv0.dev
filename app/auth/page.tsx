import { LoginForm } from "@/components/login-form";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <Link
        href="/"
        className="flex items-center gap-2 text-base text-muted-foreground ml-10"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to home
      </Link>
      <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
