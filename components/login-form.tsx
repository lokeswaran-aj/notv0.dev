"use client";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/api";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Logo } from "./ui/logo";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  async function handleSignInWithGoogle() {
    const supabase = createClient();

    if (!supabase) {
      throw new Error("Supabase is not configured");
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await signInWithGoogle(supabase, next || undefined);

      if (data?.url) {
        window.location.href = data.url;
        return;
      }
    } catch (err: unknown) {
      console.error("Error signing in with Google:", err);
      setError(
        (err as Error).message ||
          "An unexpected error occurred. Please try again."
      );
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-6 text-center">
        <div className="flex items-center justify-center gap-4">
          <Logo className="h-6 md:h-8 w-auto" />
          <h1 className="text-2xl md:text-4xl font-bold">Welcome to Not V0</h1>
        </div>
        <p className="text-muted-foreground">
          This is the last click before the fun part - Pinky promise!
        </p>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          onClick={handleSignInWithGoogle}
          variant="outline"
          className="w-full"
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          {isLoading ? "Signing in..." : "Continue with Google"}
        </Button>
      </div>
    </div>
  );
}
