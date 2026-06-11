/**
 * Validates that all required environment variables are set.
 * This prevents the application from starting or running with missing configuration.
 */

const requiredEnvs = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

export function validateEnv() {
  const missing = Object.entries(requiredEnvs)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    const errorMsg = `❌ Missing required environment variables: ${missing.join(", ")}. Please check your .env.local file.`;
    
    // In production, we throw to prevent the app from running in a broken state
    if (process.env.NODE_ENV === "production") {
      throw new Error(errorMsg);
    } else {
      // In development, we log a loud error
      console.error("\x1b[31m%s\x1b[0m", errorMsg);
    }
  }
}

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
};

// Auto-validate on import
validateEnv();
