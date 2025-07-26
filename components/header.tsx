import { signOutAction } from "@/lib/actions/auth";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ChatTitle } from "./chat/chat-title";
import { Button } from "./ui/button";
import { Logo } from "./ui/logo";

export const Header = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="h-14 fixed top-0 right-0 left-0 z-50">
      <div className="relative mx-auto flex h-full max-w-full items-center justify-between bg-transparent px-4 sm:px-6 lg:bg-transparent lg:px-8">
        <div className="flex flex-1 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-6 w-auto" />
            <h1 className="text-2xl font-bold">Not V0</h1>
          </Link>
          <ChatTitle />
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {user.user_metadata.full_name}
                </p>
                <form action={signOutAction}>
                  <Button
                    type="submit"
                    variant="ghost"
                    className="cursor-pointer text-sm font-medium text-muted-foreground"
                  >
                    Logout
                  </Button>
                </form>
              </div>
            ) : (
              <Link
                href="/auth"
                className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
