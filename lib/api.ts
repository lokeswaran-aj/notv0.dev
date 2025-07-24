import { SupabaseClient } from "@supabase/supabase-js";

export async function signInWithGoogle(supabase: SupabaseClient) {
  try {
    const isDev = process.env.NODE_ENV === "development";

    // Get base URL dynamically (will work in both browser and server environments)
    const baseUrl = isDev
      ? "http://localhost:3000"
      : typeof window !== "undefined"
      ? window.location.origin
      : `https://${process.env.NEXT_PUBLIC_DOMAIN}`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${baseUrl}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Error signing in with Google:", err);
    throw err;
  }
}
