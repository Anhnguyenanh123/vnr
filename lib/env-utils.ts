/**
 * Get environment variable with fallback
 * @param key Environment variable key
 * @param fallback Fallback value if env var is not set
 * @returns Environment variable value or fallback
 */
export function getEnvVar(key: string, fallback: string): string {
  if (typeof window !== "undefined") {
    if (key.startsWith("NEXT_PUBLIC_")) {
      const config = (globalThis as any).__NEXT_DATA__?.runtimeConfig;
      return config?.[key] || process.env[key] || fallback;
    }
    return fallback;
  }
  return process.env[key] || fallback;
}

export function getServerUrl(): string {
  return getEnvVar(
    "NEXT_PUBLIC_SERVER_URL",
    "https://mln131-internal.hyudequeue.xyz"
  );
}

export function getClientUrl(): string {
  return getEnvVar("CLIENT_URL", "https://vnr202.hyudequeue.xyz");
}

export function getServerPort(): number {
  return parseInt(getEnvVar("PORT", "25578"), 10);
}

/**
 * Get client port
 */
export function getClientPort(): number {
  return parseInt(getEnvVar("CLIENT_PORT", "25577"), 10);
}
