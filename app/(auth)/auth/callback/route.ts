import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent(
        "Missing authentication code"
      )}`
    );
  }

  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent(
        "Supabase is not enabled in this deployment."
      )}`
    );
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth error:", error);
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent(error.message)}`
    );
  }

  const user = data?.user;
  if (!user || !user.id || !user.email) {
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent("Missing user info")}`
    );
  }

  const host = request.headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";

  const redirectUrl = `${protocol}://${host}${next}`;

  return NextResponse.redirect(redirectUrl);
}
