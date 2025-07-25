import { SupabaseClient } from "@supabase/supabase-js";

const APP_DOMAIN = "https://notv0.dev";

export async function signInWithGoogle(
  supabase: SupabaseClient,
  returnUrl?: string
) {
  try {
    const isDev = process.env.NODE_ENV === "development";

    // Get base URL dynamically (will work in both browser and server environments)
    const baseUrl = isDev ? "http://localhost:3000" : APP_DOMAIN;

    // Include the next parameter in the callback URL if provided
    const callbackUrl = returnUrl
      ? `${baseUrl}/auth/callback?next=${encodeURIComponent(returnUrl)}`
      : `${baseUrl}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
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
